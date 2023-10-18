import { api } from "~/utils/api";
import { type Project } from "../types";

/**
 * Create a new project
 * @param userSecret The user secret
 * @param projectId The project id
 * @returns project data and refetch function
 */
export function trpcCreateProject(userSecret: string, project: Project) {
  const { data, refetch: createProject } = api.projects.createOne.useQuery(
    {
      secret: userSecret,
      project: project,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, createProject };
}
