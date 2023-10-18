import { api } from "~/utils/api";

/**
 * Get a project by id
 * @param userSecret The user secret
 * @param projectId The project id
 * @returns project data and refetch function
 */
export function trpcGetProject(userSecret: string, projectId: string) {
  const { data, refetch: getProject } = api.projects.getOne.useQuery(
    {
      secret: userSecret,
      id: projectId,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, getProject };
}
