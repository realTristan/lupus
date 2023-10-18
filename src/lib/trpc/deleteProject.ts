import { api } from "~/utils/api";

/**
 * Delete a project by id
 * @param userSecret The user secret
 * @param projectId The project id
 * @returns project data and refetch function
 */
export function trpcDeleteProject(userSecret: string, projectId: string) {
  const { data, refetch: deleteProject } = api.projects.deleteOne.useQuery(
    {
      secret: userSecret,
      id: projectId,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, deleteProject };
}
