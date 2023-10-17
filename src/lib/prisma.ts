import { PrismaClient } from "@prisma/client";
import { type Project, type User, type NetworkLayer } from "./types";
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
   * @param opts The find options
   * @returns The rows found
   */
  public static readonly findMany = async <T>(
    table: string,
    opts: any,
  ): Promise<T[]> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.findMany(opts);
  };

  /**
   * Finds a row in a table
   * @param table The table to find in
   * @param opts The find options
   * @returns The row found, or null if it doesn't exist
   */
  public static readonly findOne = async <T>(
    table: string,
    opts: any,
  ): Promise<T | null> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.findFirst(opts);
  };

  /**
   * Creates a row in a table
   * @param table The table to create in
   * @param opts The creation options
   * @returns The created row
   */
  public static readonly create = async <T>(
    table: string,
    opts: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.create(opts);
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
    data: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.update(data);
  };

  /**
   * Deletes a row from a table
   * @param table The table to delete from
   * @param opts The delete options
   * @returns The deleted row
   */
  public static readonly delete = async <T>(
    table: string,
    opts: any,
  ): Promise<T> => {
    const tableRef: any = Prisma.getTable(table);
    return await tableRef.delete(opts);
  };

  /**
   * Check whether the user is valid based on their user secret
   * @param userSecret The user secret
   * @returns Whether the user exists
   */
  public static readonly userValid = async (
    userSecret: string,
  ): Promise<boolean> => {
    const user: User | null = await Prisma.findOne("user", {
      where: {
        secret: userSecret,
      },
    });

    return user ? true : false;
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
      where: {
        secret: userSecret,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.findMany("project", {
      where: { userSecret: user.secret },
    });
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
    const projectId: string = project.id ? project.id : await genId();

    // Create the project
    await Prisma.create("project", {
      data: {
        ...project,
        id: projectId,
        user: {
          connect: {
            secret: userSecret,
          },
        },
        tables: {
          create: [
            {
              id: await genId(),
              name: "Table-default",
              description: "Default table",
              headers: DEFAULT_PROJECT_TABLE_HEADERS,
              values: [0, 1, 0, 2, 1, 3],
              /*
              builds: {
                create: [],
              },
              */
            },
          ],
        },
        networks: {
          create: [
            {
              id: await genId(),
              name: "Network-default",
              description: "Default network",
              layers: {
                create: [
                  {
                    id: await genId(),
                    type: "dense",
                    neurons: 1,
                    shape: 1,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Return the project id
    return projectId;
  };

  /**
   * Creates a table
   * @param projectId The project id
   * @param table The table to create
   * @returns The created table
   * @throws Error if the user is not found
   * @throws Error if the project is not found
   */
  public static readonly createTable = async (
    projectId: string,
    table: any,
  ): Promise<string> => {
    const tableId: string = table.id ? table.id : await genId();

    await Prisma.create("tableModel", {
      data: {
        ...table,
        id: tableId,
        project: {
          connect: {
            id: projectId,
          },
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
    const networkId: string = network.id ? network.id : await genId();

    await Prisma.create("networkModel", {
      data: {
        ...network,
        id: networkId,
        project: {
          connect: {
            id: projectId,
          },
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
    const layerId: string = layer.id ? layer.id : await genId();

    await Prisma.create("networkModelLayer", {
      data: {
        ...layer,
        id: layerId,
        network: {
          connect: {
            id: networkId,
          },
        },
      },
    });

    return layerId;
  };

  /**
   * Updates a project
   * @param userSecret The user secret
   * @param projectId The project id
   * @param project The project to update
   * @returns The updated project
   * @throws Error if the user is not found
   */
  public static readonly updateProject = async (
    userSecret: string,
    projectId: string,
    project: Project,
  ): Promise<Project> => {
    if (!Prisma.userValid(userSecret)) {
      throw new Error("User not found");
    }

    const existingProject: Project | null = await Prisma.findOne("project", {
      where: {
        id: projectId,
      },
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    return await Prisma.update("project", {
      where: { id: projectId, userSecret },
      data: project,
    });
  };

  /**
   * Deletes a project
   * @param userSecret The user secret
   * @param projectId The project id
   * @returns The deleted project
   * @throws Error if the user is not found
   */
  public static readonly deleteProject = async (
    userSecret: string,
    projectId: string,
  ): Promise<Project> => {
    if (!Prisma.userValid(userSecret)) {
      throw new Error("User not found");
    }

    // Delete the project and all of its tables and networks
    return await Prisma.delete("project", {
      where: { id: projectId, userSecret },
      include: {
        tables: true,
        networks: {
          include: {
            layers: true,
          },
        },
      },
    });
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
    if (!Prisma.userValid(userSecret)) {
      throw new Error("User not found");
    }

    // Get the project along with the tables, networks, and network layers
    return (await Prisma.findOne("project", {
      where: { id, userSecret },
      include: {
        tables: {
          include: {
            builds: true,
          },
        },
        networks: {
          include: {
            layers: true,
          },
        },
      },
    })) as Project | null;
  };

  /**
   * Add an user to the database
   * @param user The user to add
   * @returns The added user
   * @throws Error if the user already exists
   */
  public static readonly createUser = async (user: User): Promise<User> => {
    if (await Prisma.userValid(user.secret)) {
      throw new Error("User already exists");
    }

    return await Prisma.create("user", {
      data: user,
    });
  };
}

// create a global prisma instance
const global = globalThis as any;
if (!global.prisma) {
  global.prisma = new Prisma();
}
