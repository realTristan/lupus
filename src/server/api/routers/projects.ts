import { z } from "zod";
import { Prisma } from "~/lib/prisma";
import { type Project } from "~/lib/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * Get projects procedure for the projects router
 */
const getProjectsProcedure = publicProcedure
  .input(z.object({ secret: z.string() }))
  .query(async ({ input }) => {
    if (!input.secret) {
      return {
        result: null,
      };
    }

    return await Prisma.getProjects(input.secret)
      .catch((e) => {
        console.error(e.message);
      })
      .then((res) => {
        return {
          result: res,
        };
      });
  });

/**
 * Create project procedure for the projects router
 */
const createProjectProcedure = publicProcedure
  .input(
    z.object({
      secret: z.string(),
      project: z.object({
        name: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
      }),
    }),
  )
  .query(async ({ input }) => {
    if (!input.secret) {
      return {
        result: null,
      };
    }

    return await Prisma.createProject(input.secret, input.project as Project)
      .catch((e) => {
        console.error(e.message);
      })
      .then((res) => {
        return {
          result: res,
        };
      });
  });

/**
 * Get project procedure for the projects router
 */
const getProjectProcedure = publicProcedure
  .input(z.object({ secret: z.string(), id: z.string() }))
  .query(async ({ input }) => {
    if (!input.secret || !input.id) {
      return {
        result: null,
      };
    }

    return await Prisma.getProject(input.secret, input.id)
      .catch((e) => {
        console.error(e.message);
      })
      .then((res) => {
        return {
          result: res,
        };
      });
  });

/**
 * Delete project procedure for the projects router
 */
const deleteProjectProcedure = publicProcedure
  .input(z.object({ secret: z.string(), id: z.string() }))
  .query(async ({ input }) => {
    if (!input.secret || !input.id) {
      return {
        result: null,
      };
    }

    return await Prisma.deleteProject(input.secret, input.id)
      .catch((e) => {
        console.error(e.message);
      })
      .then((res) => {
        return {
          result: res,
        };
      });
  });

/**
 * The projects router
 */
export const projectsRouter = createTRPCRouter({
  getProjects: getProjectsProcedure,
  createProject: createProjectProcedure,
  getProject: getProjectProcedure,
  deleteProject: deleteProjectProcedure,
});
