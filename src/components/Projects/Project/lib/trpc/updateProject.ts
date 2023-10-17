import { type Session } from "next-auth";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";

/**
 * Get a project by id
 * @param session The session
 * @param router The router
 * @returns The project
 */
export function trpcUpdateProject(session: Session | null, project: Project) {
  const { data, refetch: updateProject } = api.projects.updateOne.useQuery(
    {
      secret: session?.user.secret ?? "",
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
