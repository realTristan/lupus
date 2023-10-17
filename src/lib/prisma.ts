import { PrismaClient } from "@prisma/client";
import {
  type Table,
  type Project,
  type User,
  type Network,
  type NetworkLayer,
} from "./types";
import { genId } from "./crypto";
import { DEFAULT_PROJECT_TABLE_HEADERS } from "./constants";

export class Prisma extends PrismaClient {
  constructor() {
    super();
    this.$connect();
    console.log("Prisma connected");
  }

  /**
   * Get a table
   * @param table The table to get
   * @returns The table
   */
  public static readonly getTable = (table: string) => {
    const global = globalThis as any;
    return global.prisma[table];
  };

  /**
   * Finds many rows in a table
   * @param table The table to find in
   * @param where The where clause to find
   * @returns The rows found
   */
  public static readonly findMany = async <T>(
    table: string,
    where: any,
  ): Promise<T[]> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.findMany({ where });
  };

  /**
   * Finds a row in a table
   * @param table The table to find in
   * @param where The where clause to find
   * @returns The row found, or null if it doesn't exist
   */
  public static readonly findOne = async <T>(
    table: string,
    where: any,
  ): Promise<T | null> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.findFirst({ where });
  };

  /**
   * Creates a row in a table
   * @param table The table to create in
   * @param data The data to create
   * @returns The created row
   */
  public static readonly create = async <T>(
    table: string,
    data: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.create({ data });
  };

  /**
   * Updates a row in a table
   * @param table The table to update
   * @param where The where clause to update
   * @param data The data to update
   * @returns The updated row
   */
  public static readonly update = async <T>(
    table: string,
    where: any,
    data: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.update({ where, data });
  };

  /**
   * Deletes a row from a table
   * @param table The table to delete from
   * @param where The where clause to delete
   * @returns The deleted row
   */
  public static readonly delete = async <T>(
    table: string,
    where: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.delete({ where });
  };

  /**
   * Gets all projects for a user
   * @param userSecret The user secret
   * @returns The projects
   * @throws Error if the user is not found
   */
  public static readonly getProjects = async (
    userSecret: string,
  ): Promise<Project[]> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.findMany("project", { userSecret: user.secret });
  };

  /**
   * Creates a project
   * @param userSecret The user secret
   * @param project The project to create
   * @returns The created project
   * @throws Error if the user is not found
   */
  public static readonly createProject = async (
    userSecret: string,
    project: Project,
  ): Promise<string> => {
    // Generate a new project id
    const projectId: string = project.id ? project.id : genId();

    // Create the project
    await Prisma.create("project", {
      ...project,
      id: projectId,
      user: {
        connect: {
          secret: userSecret,
        },
      },
    });

    // Create a new table
    await Prisma.createTable(userSecret, projectId, {
      name: "Table 1",
      description: "Default table",
      headers: DEFAULT_PROJECT_TABLE_HEADERS,
      values: [0, 1, 0, 2, 1, 3],
    });

    // Create a network model
    const networkId: string = await Prisma.createNetwork(projectId, {
      name: "Network 1",
      description: "Default network",
    });

    // Create a network layer
    await Prisma.createNetworkLayer(networkId, {
      type: "dense",
      neurons: 1,
      shape: 1,
    });

    // Return the project id
    return projectId;
  };

  /**
   * Creates a table
   * @param userSecret The user secret
   * @param projectId The project id
   * @param table The table to create
   * @returns The created table
   * @throws Error if the user is not found
   * @throws Error if the project is not found
   */
  public static readonly createTable = async (
    userSecret: string,
    projectId: string,
    table: any,
  ): Promise<string> => {
    const tableId: string = table.id ? table.id : genId();

    await Prisma.create("tableModel", {
      ...table,
      id: tableId,
      project: {
        connect: {
          id: projectId,
        },
      },
    });

    return tableId;
  };

  /**
   * Creates a network
   * @param projectId The project id
   * @param network The network to create
   * @returns The created network
   * @throws Error if the user is not found
   * @throws Error if the project is not found
   */
  public static readonly createNetwork = async (
    projectId: string,
    network: any,
  ): Promise<string> => {
    const networkId: string = network.id ? network.id : genId();

    await Prisma.create("networkModel", {
      ...network,
      id: networkId,
      project: {
        connect: {
          id: projectId,
        },
      },
    });
    return networkId;
  };

  /**
   * Creates a network layer
   * @param networkId The network id
   * @param layer The layer to create
   * @returns The created layer
   */
  public static readonly createNetworkLayer = async (
    networkId: string,
    layer: NetworkLayer,
  ): Promise<string> => {
    const layerId: string = layer.id ? layer.id : genId();

    await Prisma.create("networkModelLayer", {
      ...layer,
      id: layerId,
      network: {
        connect: {
          id: networkId,
        },
      },
    });

    return layerId;
  };

  /**
   * Updates a project
   * @param userSecret The user secret
   * @param id The project id
   * @param project The project to update
   * @returns The updated project
   * @throws Error if the user is not found
   */
  public static readonly updateProject = async (
    userSecret: string,
    id: string,
    project: Project,
  ): Promise<Project> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingProject: Project | null = await Prisma.findOne("project", {
      id,
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    return await Prisma.update("project", { id, userSecret }, project);
  };

  /**
   * Deletes a project
   * @param userSecret The user secret
   * @param id The project id
   * @returns The deleted project
   * @throws Error if the user is not found
   */
  public static readonly deleteProject = async (
    userSecret: string,
    id: string,
  ): Promise<Project> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.delete("project", { id, userSecret });
  };

  /**
   * Get a project
   * @param userSecret The user secret
   * @param id The project id
   * @returns The project
   */
  public static readonly getProject = async (
    userSecret: string,
    id: string,
  ): Promise<Project | null> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get the base project
    const project: Project | null = await Prisma.findOne("project", {
      id,
      userSecret,
    });

    if (!project) return null;

    // Get the project tables
    const tables: Table[] | null = await Prisma.findMany("tableModel", {
      projectId: id,
    });

    if (!tables)
      return {
        ...project,
        tables: [],
      };

    // Get the projects networks
    const networks: Network[] | null = await Prisma.findMany("networkModel", {
      projectId: id,
    });

    // Get the network layers
    if (!networks) {
      return {
        ...project,
        networks: [],
        tables,
      };
    }

    // Get the network layers
    for (const network of networks) {
      const layers = (await Prisma.findMany("networkModelLayer", {
        networkModelId: network.id,
      })) as NetworkLayer[] | null;

      // Set the layers
      layers ? (network.layers = layers) : (network.layers = []);
    }

    return {
      ...project,
      networks,
      tables,
    };
  };

  /**
   * Add an user to the database
   * @param user The user to add
   * @returns The added user
   * @throws Error if the user already exists
   */
  public static readonly addUser = async (user: User): Promise<User> => {
    const existingUser: User | null = await Prisma.findOne("user", {
      email: user.email,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    return await Prisma.create("user", user);
  };
}

// create a global prisma instance
const global = globalThis as any;
if (!global.prisma) {
  global.prisma = new Prisma();
}
