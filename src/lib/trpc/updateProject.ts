import { type Project } from "~/lib/types";
import { api } from "~/utils/api";

/**
 * Get a project by id
 * @param userSecret The user secret
 * @param project The project
 * @returns project data and refetch function
 */
export function trpcUpdateProject(userSecret: string, project: Project) {
  const { data, refetch: updateProject } = api.projects.updateOne.useQuery(
    {
      secret: userSecret,
      id: project.id,
      project: {
        name: project.name,
        description: project.description,
        tags: project.tags,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, updateProject };
}
