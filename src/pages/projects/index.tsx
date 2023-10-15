import Head from "next/head";
import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/Loading";
import { type Project } from "~/lib/types";
import { api } from "~/utils/api";
import PlusSmallSVG from "~/components/svgs/Plus";
import Link from "next/link";
import Image from "next/image";

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

    if (!session?.user.secret) {
      return <></>;
    }

    // Return the projects
    return (
      <>
        <Head>
          <title>Projects | arcai</title>
        </Head>

        <Link
          href="/"
          className="fixed left-10 top-10 flex flex-row items-center justify-center gap-4"
        >
          <Image
            src="/images/arcai_logo.png"
            width={50}
            height={100}
            alt=""
            className="w-auto rounded-full"
          />
          <h1 className="mb-2 text-3xl font-bold">arcai</h1>
        </Link>

        <div className="fixed right-10 top-10 flex flex-row items-center justify-center gap-6">
          <Link
            href="/projects/new"
            className="m-4 flex flex-row gap-2 rounded-full bg-slate-950 px-10 py-4 text-white shadow-xl hover:bg-slate-800"
          >
            <PlusSmallSVG />
            <p>New Project</p>
          </Link>
          <Image
            src={session?.user.image ?? ""}
            width={65}
            height={65}
            alt=""
            className="rounded-full"
          />
        </div>

        <main className="mt-24 flex min-h-screen flex-col items-center p-14">
          {!projects?.data?.result?.length ? (
            <div className="mt-20 flex flex-col items-center justify-center text-center">
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
  const { refetch } = api.projects.deleteProject.useQuery(
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
      <td className="border px-4 py-2">
        <div>
          <Link
            href={`/projects/id/${props.p.id}`}
            className="m-2 rounded-md bg-slate-950 px-5 py-3 font-medium tracking-wide text-white shadow-xl hover:bg-white hover:text-slate-950"
          >
            Open
          </Link>
          <button
            className="m-2 rounded-md bg-red-500 px-5 py-3 font-medium tracking-wide text-white shadow-xl hover:bg-red-600"
            onClick={() => {
              refetch();
              router.reload();
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
