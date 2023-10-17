import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/svgs/Loading";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { type Table, type Network, type Project } from "~/lib/types";
import TableModel from "~/components/TableModel";
import { ObjectState } from "~/lib/state";
import NetworkModel from "~/components/NetworkModel";
import { useState } from "react";

/**
 * Project page
 * @returns {JSX.Element} JSX.Element
 */
export default function ProjectPage(): JSX.Element {
  /**
   * Get the users session to check if they're logged in.
   * @type {Session | undefined}
   * @returns {Session | undefined}
   */
  const { data: session, status } = useSession();

  /**
   * Next router for redirecting to the login endpoint if the
   * user isn't logged in.
   */
  const router: NextRouter = useRouter();

  /**
   * The project data
   */
  const project = new ObjectState<Project>({} as Project);
  const { data, refetch: getProject } = api.projects.getOne.useQuery(
    {
      secret: session?.user.secret ?? "",
      id: router.query.id as string,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  /**
   * Update the project settings
   */
  const { refetch: _updateProject } = api.projects.updateOne.useQuery(
    {
      secret: session?.user.secret ?? "",
      id: router.query.id as string,
      project: {
        ...project.value,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  /**
   * Store the networks
   */
  const [activeNetwork, setActiveNetwork] = useState<Network>();

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    // Verify states and data
    if (!session?.user.secret) return <></>;
    if (!data?.result) {
      getProject().then((res) => {
        if (!res.data?.result) return;

        project.set(res.data.result);
        setActiveNetwork(res.data.result.networks[0]);
      });

      return <LoadingCenter />;
    }

    // Return the jsx
    return (
      <>
        <Head>
          <title>{data.result.name} | arcai</title>
        </Head>

        <Navbar />

        <main className="mt-40 flex min-h-screen flex-col gap-10 p-14">
          {/* Project title and description */}
          <div className="text-center">
            <h1 className="text-6xl font-black">{data.result.name}</h1>
            <p className="mt-2 text-2xl font-thin">{data.result.description}</p>
          </div>

          {/* Map the networks */}
          {project.value.networks?.map((network: Network) => {
            return (
              <div key={network.id} className="w-full">
                <div className="flex flex-row justify-between">
                  <div className="w-full">
                    <h1 className="w-full text-5xl font-extrabold">
                      {network.name}
                    </h1>
                    <p className="mt-2 w-full text-xl font-thin">
                      {network.description}
                    </p>
                  </div>
                  <button
                    disabled={network === activeNetwork}
                    onClick={() => setActiveNetwork(network)}
                    className="flex flex-row items-center justify-center gap-4 rounded-md border-2 border-slate-100 bg-white px-10 py-7 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <p>
                      {network == activeNetwork
                        ? "Already active"
                        : "Set as active"}
                    </p>
                  </button>
                </div>

                <NetworkModel project={project} network={network} />
              </div>
            );
          })}

          {/* Map the tables */}
          {data.result.tables?.map((table: Table) => {
            return (
              <div key={table.id} className="w-full">
                <h1 className="w-full text-5xl font-extrabold">{table.name}</h1>
                <p className="mt-2 w-full text-xl font-thin">
                  {table.description}
                </p>
                <div className="m-3 w-full">
                  <TableModel
                    headers={table.headers}
                    values={table.values}
                    layers={activeNetwork?.layers ?? []}
                  />
                </div>
              </div>
            );
          })}

          {/* Model builds */}
          <h1 className="w-fit text-5xl font-thin">Model Builds</h1>
        </main>
      </>
    );
  }

  // If the user isn't logged in, return a loading component
  return <LoadingCenter />;
}
