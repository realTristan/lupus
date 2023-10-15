import { z } from "zod";
import { Prisma } from "~/lib/prisma";

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
 * The projects router
 */
export const projectsRouter = createTRPCRouter({
  getProjects: getProjectsProcedure,
});
