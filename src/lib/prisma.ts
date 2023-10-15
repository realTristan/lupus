import { PrismaClient } from "@prisma/client";
import { type Project, type User } from "./types";

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
  ): Promise<Project> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const opts = {
      ...project,
      userSecret,
    };

    return await Prisma.create("project", opts);
  };

  /**
   * Updates a project
   * @param userSecret The user secret
   * @param project The project to update
   * @returns The updated project
   * @throws Error if the user is not found
   */
  public static readonly updateProject = async (
    userSecret: string,
    project: Project,
  ): Promise<Project> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.update("project", { id: project.id }, project);
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
    id: number,
  ): Promise<Project> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.delete("project", { id });
  };

  /**
   * Get a project
   * @param userSecret The user secret
   * @param id The project id
   * @returns The project
   */
  public static readonly getProject = async (
    userSecret: string,
    id: number,
  ): Promise<Project | null> => {
    const user: User | null = await Prisma.findOne("user", {
      secret: userSecret,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await Prisma.findOne("project", { id });
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
