import Head from "next/head";
import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/svgs/Loading";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";
import Link from "next/link";
import Navbar from "~/components/Navbar";
import ExternalSVG from "~/components/svgs/External";
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
  const projects = api.projects.getAll.useQuery({
    secret: session?.user.secret ?? "",
  });

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    // If the query is loading, return a loading component
    if (projects.isLoading) {
      return <LoadingCenter />;
    }

    if (!session?.user.secret) {
      return <></>;
    }

    // Return the projects
    return (
      <>
        <Head>
          <title>Projects | arcai</title>
        </Head>

        <Navbar />

        <main className="mt-24 flex min-h-screen flex-col items-center p-14">
          {!projects?.data?.result?.length ? (
            <div className="mt-20 flex flex-col items-center justify-center text-center">
              <p className="text-7xl font-black ">Nothing&#39;s here.</p>
              <p className="mt-3 text-base font-normal">
                You don&#39;t have any projects yet. Create one to get started.
              </p>
              <Link
                href="/projects/new"
                className="mt-5 flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
              >
                <ExternalSVG className="fill-slate-950" /> <p>Get started</p>
              </Link>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Created at</th>
                  <th className="px-4 py-2">Last updated at</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {projects?.data?.result?.map((project: Project) => {
                  return (
                    <ProjectCard
                      p={project}
                      key={project.id}
                      sec={session?.user.secret ?? ""}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
        </main>
      </>
    );
  }

  return <LoadingCenter />;
}

/**
 * Project card
 * @param {Project} props.project Project
 * @param {string | null} props.secret User secret
 * @returns {JSX.Element} JSX.Element
 */
const ProjectCard = (props: { p: Project; sec: string }): JSX.Element => {
  const { refetch } = api.projects.deleteOne.useQuery(
    {
      secret: props.sec,
      id: props.p.id,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  const router = useRouter();

  return (
    <tr key={props.p.id} className="cursor-pointer hover:bg-slate-100/60">
      <td className="border px-4 py-2">{props.p.name}</td>
      <td className="border px-4 py-2">{props.p.description}</td>
      <td className="border px-4 py-2">
        {new Date(props.p.createdAt).toLocaleString()}
      </td>
      <td className="border px-4 py-2">
        {new Date(props.p.updatedAt).toLocaleString()}
      </td>
      <td className="flex flex-col gap-2 border px-4 py-2">
        <Link
          href={`/projects/id/${props.p.id}`}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-base font-normal tracking-wider text-slate-950 hover:border-slate-200 hover:bg-slate-200"
        >
          <ExternalSVG className="fill-slate-950" /> <p>Open Project</p>
        </Link>

        <button
          onClick={() => {
            refetch();
            router.reload();
          }}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-red-500 bg-red-500 px-14 py-3 text-base font-normal tracking-wider text-white hover:border-red-600 hover:bg-red-600"
        >
          <TrashcanSVG className="fill-white" /> <p>Delete Project</p>
        </button>
      </td>
    </tr>
  );
};
