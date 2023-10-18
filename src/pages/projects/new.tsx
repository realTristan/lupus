import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/SvgComponents/Loading";
import Head from "next/head";
import Navbar from "~/components/Navbar/Navbar";
import CreateNewProjectButton from "~/components/ProjectsPage/CreateNewProjectButton";
import { trpcCreateProject } from "~/lib/trpc/createProject";
import CreateNewProjectInputs from "~/components/ProjectsPage/CreateNewProjectInputs";
import { generateDefaultProject } from "~/utils/projects";

// Popup dialog when the user wants to create a new project
export default function NewProjectPage(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [project, setProject] = useState(generateDefaultProject());
  const { createProject } = trpcCreateProject(
    session?.user.secret ?? "",
    project,
  );

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    if (!session.user.secret) return <></>;

    return (
      <>
        <Head>
          <title>New Project | Lupus AI</title>
        </Head>

        <Navbar />

        <main className="flex min-h-screen flex-col items-center justify-center">
          <p className="text-3xl font-bold text-slate-950">
            Create a new project
          </p>
          <p className="mt-1 text-sm font-normal italic text-slate-950">
            Projects are used to organize your models and data.
          </p>
          <div className="my-4 flex w-1/3 flex-col items-center justify-center">
            <CreateNewProjectInputs project={project} setProject={setProject} />

            <div className="flex w-full flex-row gap-2">
              <CreateNewProjectButton
                project={project}
                router={router}
                createProject={async () => {
                  await createProject();
                }}
              />
              <button
                onClick={() => router.push("/projects")}
                className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
              >
                <p>Cancel</p>
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return <LoadingCenter />;
}
