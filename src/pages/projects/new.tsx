import { useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/Loading";

// Popup dialog when the user wants to create a new project
export default function NewProjectPage(): JSX.Element {
  const { data: session, status } = useSession();
  const router = useRouter();

  const randomProjectId: number = Math.floor(Math.random() * 1000000);
  const [project, setProject] = useState({
    name: `my-project-${randomProjectId}`,
    description: "A super cool description!",
    type: "table",
    tags: [],
  });

  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  if (status === "authenticated") {
    if (!session.user.secret) {
      return <></>;
    }

    const { refetch } = api.projects.createProject.useQuery(
      {
        secret: session.user.secret,
        project,
      },
      {
        enabled: false,
        refetchOnWindowFocus: false,
      },
    );

    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-4xl font-bold text-slate-950">
          Create a new project
        </p>
        <p className="mt-1 text-base font-normal italic text-slate-950">
          Projects are used to organize your data
        </p>
        <div className="mt-2 flex w-1/3 flex-col items-center justify-center">
          <input
            className="m-3 h-12 w-full rounded-none border-b-2 border-b-slate-950 bg-slate-50 px-4 py-2 text-slate-600"
            placeholder="Project Name"
            onChange={(e) => setProject({ ...project, name: e.target.value })}
          />
          <input
            className="m-3 h-12 w-full rounded-none border-b-2 border-b-slate-950 bg-slate-50 px-4 py-2 text-slate-600"
            placeholder="Project Description"
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          <div className="flex w-full flex-row gap-4">
            <button
              onClick={() => {
                refetch().then(() => {
                  router.push("/projects").catch((e) => console.log(e.message));
                });
              }}
              className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-8 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
            >
              <p>Create</p>
            </button>
            <button
              onClick={() =>
                router.push("/projects").catch((e) => console.log(e.message))
              }
              className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-8 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
            >
              <p>Cancel</p>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <LoadingCenter />;
}
