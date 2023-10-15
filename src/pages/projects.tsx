import Head from "next/head";
import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/Loading";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";
import PlusSmallSVG from "~/components/svgs/Plus";
import { useState } from "react";

/**
 * Projects page
 * @returns {JSX.Element} JSX.Element
 */
export default function Projects(): JSX.Element {
  // Check if the user is logged in
  const { data: session, status } = useSession();

  // Track the popup dialog for creating a new project
  const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);

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
            <button
              onClick={() => setShowProjectDialog(true)}
              className="fixed right-10 m-4 flex flex-row gap-2 rounded-md bg-slate-950 px-10 py-4 text-white"
            >
              <PlusSmallSVG />
              <p>New Project</p>
            </button>
          </div>

          {!hasProjects(projects) && (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-7xl font-black ">Nothing&#39;s here.</p>
              <p className="mt-3 text-lg font-normal">
                You don&#39;t have any projects yet. Create one to get started.
              </p>
              <button
                onClick={() => setShowProjectDialog(true)}
                className="m-4 rounded-md bg-slate-950 px-10 py-4 text-white"
              >
                Get Started
              </button>
            </div>
          )}

          {showProjectDialog && (
            <NewProjectDialog setShowProjectDialog={setShowProjectDialog} />
          )}

          <div className="flex flex-col items-start justify-start">
            {projects.data?.result?.map((project: Project) => (
              <div
                key={Math.random()}
                className="flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center justify-start">
                  <div className="flex flex-col items-start justify-center">
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-base font-normal">
                      {project.description}
                    </p>
                  </div>
                </div>
                <button className="m-4 rounded-md bg-slate-950 px-10 py-4 text-white">
                  Edit
                </button>
              </div>
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

// Popup dialog when the user wants to create a new project
const NewProjectDialog = (props: {
  setShowProjectDialog: (show: boolean) => void;
}): JSX.Element => {
  return (
    <div
      className="absolute m-10 flex h-screen w-screen flex-col items-center justify-center bg-slate-950/80 p-10 backdrop-blur-md"
      style={{ zIndex: 1000 }}
    >
      <p className="text-4xl font-bold text-white">Create a new project</p>
      <p className="mt-2 text-base font-normal italic text-white">
        Projects are used to organize your data
      </p>
      <div className="flex flex-col items-center justify-center">
        <input
          className="m-3 h-12 w-96 rounded-md border-b-2 border-b-white bg-slate-200/20 px-4 py-2 text-white"
          placeholder="Project Name"
        />
        <input
          className="m-3 h-12 w-96 rounded-md border-b-2 border-b-white bg-slate-200/20 px-4 py-2 text-white"
          placeholder="Project Description"
        />
        <div className="flex flex-row gap-4">
          <button className="m-4 rounded-md bg-slate-950 px-10 py-4 text-white">
            Create
          </button>
          <button
            onClick={() => props.setShowProjectDialog(false)}
            className="m-4 rounded-md bg-slate-950 px-10 py-4 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
