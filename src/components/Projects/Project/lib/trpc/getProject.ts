import { type Session } from "next-auth";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";

/**
 * Get a project by id
 * @param session The session
 * @param router The router
 * @returns The project
 */
export function trpcGetProject(session: Session | null, project: Project) {
  const { data, refetch: getProject } = api.projects.getOne.useQuery(
    {
      secret: session?.user.secret ?? "",
      id: project.id,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return { data, getProject };
}
