import Head from "next/head";
import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/Loading";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";
import PlusSmallSVG from "~/components/svgs/Plus";
import Link from "next/link";
import TrashcanSVG from "~/components/svgs/Trashcan";

/**
 * Projects page
 * @returns {JSX.Element} JSX.Element
 */
export default function Projects(): JSX.Element {
  // Check if the user is logged in
  const { data: session, status } = useSession();

  // Next router for redirecting to the login endpoint if the
  // user isn't logged in.
  const router: NextRouter = useRouter();

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));

    return <LoadingCenter />;
  }

  // Get the users projects
  const projects = api.projects.getProjects.useQuery({
    secret: session?.user.secret ?? "",
  });

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    // If the query is loading, return a loading component
    if (projects.isLoading) {
      return <LoadingCenter />;
    }

    // Return the projects
    return (
      <>
        <Head>
          <title>Projects | arcai</title>
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="fixed top-16 flex flex-row items-center justify-between">
            <h1 className="fixed left-10 m-4 text-4xl font-black">Projects</h1>
            <Link
              href="/projects/new"
              className="fixed right-10 m-4 flex flex-row gap-2 rounded-full bg-slate-950 px-10 py-4 text-white shadow-xl hover:bg-slate-800"
            >
              <PlusSmallSVG />
              <p>New Project</p>
            </Link>
          </div>

          {!hasProjects(projects) && (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-7xl font-black ">Nothing&#39;s here.</p>
              <p className="mt-3 text-lg font-normal">
                You don&#39;t have any projects yet. Create one to get started.
              </p>
              <Link
                href="/projects/new"
                className="m-4 rounded-full bg-slate-950 px-10 py-4 font-bold tracking-wide text-white hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          )}

          <div className="flex w-full flex-col items-start justify-start p-10">
            {projects.data?.result?.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                secret={session.user.secret}
              />
            ))}
          </div>
        </main>
      </>
    );
  }

  return <LoadingCenter />;
}

const hasProjects = (projects: any): boolean => {
  return projects?.data?.result?.length;
};

const ProjectCard = (props: {
  project: Project;
  secret: string | null;
}): JSX.Element => {
  if (!props.secret) {
    return <></>;
  }

  const { refetch } = api.projects.deleteProject.useQuery(
    {
      secret: props.secret,
      id: props.project.id,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="m-4 flex flex-row items-center justify-start">
      <Link
        href={`/projects/id/${props.project.id}`}
        className="flex flex-row items-center justify-between gap-10 rounded-full bg-slate-100/80 px-14 py-5 hover:bg-slate-200/70"
      >
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-black">{props.project.name}</p>
          <p className="text-lg font-normal">{props.project.description}</p>
        </div>

        <button
          onClick={() => {
            refetch();
            window.location.reload();
          }}
          className="m-4 rounded-full bg-slate-950 p-5 text-white shadow-xl hover:bg-red-500"
        >
          <TrashcanSVG />
        </button>
      </Link>
    </div>
  );
};
