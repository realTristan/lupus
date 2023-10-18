import { api } from "~/utils/api";

/**
 * Get all projects for the user
 * @param userSecret The user secret
 * @returns projects data and refetch function
 */
export function trpcGetAllProjects(userSecret: string) {
  const { data, refetch: getAllProjects } = api.projects.getAll.useQuery(
    {
      secret: userSecret,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, getAllProjects };
}
