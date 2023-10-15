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
        <p className="mt-2 text-base font-normal italic text-slate-950">
          Projects are used to organize your data
        </p>
        <div className="flex flex-col items-center justify-center">
          <input
            className="m-3 h-12 w-96 rounded-none border-b-2 border-b-slate-950 bg-slate-50 px-4 py-2 text-slate-600"
            placeholder="Project Name"
            onChange={(e) => setProject({ ...project, name: e.target.value })}
          />
          <input
            className="m-3 h-12 w-96 rounded-none border-b-2 border-b-slate-950 bg-slate-50 px-4 py-2 text-slate-600"
            placeholder="Project Description"
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />
          <div className="flex flex-row gap-4">
            <button
              onClick={() => {
                refetch().then(() => {
                  router.push("/projects").catch((e) => console.log(e.message));
                });
              }}
              className="m-4 rounded-full bg-slate-950 px-10 py-4 text-white shadow-xl hover:bg-white hover:text-slate-950"
            >
              Create
            </button>
            <button
              onClick={() =>
                router.push("/projects").catch((e) => console.log(e.message))
              }
              className="m-4 rounded-full bg-slate-950 px-10 py-4 text-white shadow-xl hover:bg-white hover:text-slate-950"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <LoadingCenter />;
}
