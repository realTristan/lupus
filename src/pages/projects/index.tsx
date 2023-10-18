import Head from "next/head";
import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/svgs/Loading";
import Navbar from "~/components/Navbar";
import NoProjectsInterface from "~/components/Projects/NoProjectsInterface";
import ProjectsTable from "~/components/Projects/ProjectsTable";
import { type Project } from "~/lib/types";
import { trpcGetAllProjects } from "~/lib/trpc/getAllProjects";

/**
 * Projects page
 * @returns {JSX.Element} JSX.Element
 */
export default function Projects(): JSX.Element {
  const { data: session, status } = useSession();
  const router: NextRouter = useRouter();

  // Fetch for getting all of the user projects via trpc
  const { data: projectsData, getAllProjects } = trpcGetAllProjects(
    session?.user.secret ?? "",
  );

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  // Fetch all of the projects
  getAllProjects();

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    if (!projectsData || !projectsData.result) {
      return <LoadingCenter />;
    }

    // Store the projects in a constant variable
    const projects: Project[] | null = projectsData.result;
    const hasProjects: boolean = projects !== null && projects.length > 0;

    // Return the projects
    return (
      <>
        <Head>
          <title>Projects | arcai</title>
        </Head>

        <Navbar />

        <main className="mt-40 flex min-h-screen flex-col items-center p-14">
          {hasProjects ? (
            <ProjectsTable
              projects={projects}
              router={router}
              session={session}
            />
          ) : (
            <NoProjectsInterface />
          )}
        </main>
      </>
    );
  }

  return <LoadingCenter />;
}
