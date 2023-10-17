import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/svgs/Loading";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { type Table, type Network, type Project } from "~/lib/types";
import TableModel from "~/components/TableModel/TableModel";
import { ObjectState } from "~/lib/state";
import NetworkModel from "~/components/NetworkModel/NetworkModel";
import { genId } from "~/lib/crypto";
import PlusSVG from "~/components/svgs/Plus";
import { MAX_NETWORKS } from "~/lib/constants";

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
        name: project.value.name,
        description: project.value.description,
        tags: project.value.tags,
      },
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  /**
   * Update the project tables builds
   */

  /**
   * Add a new network
   */

  /**
   * Add a new network layer
   */

  /**
   * Update the project network layers
   */

  /**
   * Add a new table
   */

  /**
   * Update table data/headers
   */

  /**
   * Store the networks in a state
   */
  const activeNetwork = new ObjectState<Network>({} as Network);

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    // Verify states and data
    if (!session?.user.secret) return <></>;
    if (!project.updated || !data?.result) {
      getProject().then((res) => {
        if (!res.data?.result) return;

        project.set(res.data.result);
        activeNetwork.set(res.data.result.networks[0] ?? ({} as Network));
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

        {/* A side menu that lists all of the project networks and tables */}
        <div className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col gap-7 bg-white p-10 pt-48">
          {/* Project name and description */}
          <div>
            <h1 className="text-2xl font-black">{data.result.name}</h1>
            <p className="text-md mt-1 font-thin">{data.result.description}</p>
          </div>
          {/* Networks */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-black">Networks</h1>
            {project.value.networks?.map((network: Network) => {
              return (
                <a
                  href={`#${network.id}`}
                  key={network.id}
                  className={`flex flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 ${
                    activeNetwork.value.id === network.id ? "bg-slate-50" : ""
                  }`}
                  onClick={() => activeNetwork.set(network)}
                >
                  <span>{network.name}</span>
                </a>
              );
            })}
          </div>

          {/* Tables */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-black">Tables</h1>
            {data.result.tables?.map((table: Table) => {
              return (
                <a
                  href={`#${table.id}`}
                  key={table.id}
                  className="flex flex-row items-center justify-start gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
                >
                  <span>{table.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        <main className="flex min-h-screen flex-col gap-7 p-14 pl-80 pt-52">
          {/* Project title and description */}
          <div className="text-center">
            <h1 className="text-6xl font-black">{data.result.name}</h1>
            <p className="mt-2 text-2xl font-thin">{data.result.description}</p>
          </div>

          {/* Map the networks */}
          {project.value.networks?.map((network: Network) => {
            return (
              <NetworkModel
                key={network.id}
                project={project}
                network={network}
                activeNetwork={activeNetwork}
              />
            );
          })}

          {/* Map the tables */}
          {data.result.tables?.map((table: Table) => {
            return (
              <TableModel
                key={table.id}
                headers={table.headers}
                values={table.values}
                activeNetwork={activeNetwork.value}
                table={table}
              />
            );
          })}

          {/* Create a new table  or network dropdown */}
          <div className="flex w-full flex-row gap-2">
            <CreateNewTableButton />
            <CreateNewNetworkButton project={project} />
          </div>
        </main>
      </>
    );
  }

  // If the user isn't logged in, return a loading component
  return <LoadingCenter />;
}

/**
 * Create a new table button
 * @param {Object} props Props
 * @returns {JSX.Element} JSX.Element
 */
function CreateNewTableButton(props: {}): JSX.Element {
  return (
    <button
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      onClick={async () => {
        return;
      }}
    >
      <PlusSVG className="fill-slate-950" /> <p>Create a new table</p>
    </button>
  );
}

/**
 * Create a new network button
 * @param {Object} props Props
 * @returns {JSX.Element} JSX.Element
 */
function CreateNewNetworkButton(props: {
  project: ObjectState<Project>;
}): JSX.Element {
  return (
    <button
      disabled={props.project.value.networks.length >= MAX_NETWORKS}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
      onClick={async () => {
        if (props.project.value.networks.length >= MAX_NETWORKS) {
          return;
        }

        const networkId: string = await genId();
        const newNetwork: Network = {
          id: networkId,
          name: `Network-${networkId.slice(0, 5)}`,
          description: "User created network",
          layers: [
            {
              id: await genId(),
              type: "dense",
              neurons: 1,
              shape: 1,
            },
          ],
        };

        props.project.set({
          ...props.project.value,
          networks: [...props.project.value.networks, newNetwork],
        });
      }}
    >
      {props.project.value.networks.length >= MAX_NETWORKS ? (
        <p>Maximum networks limit reached</p>
      ) : (
        <>
          <PlusSVG className="fill-slate-950" /> <p>Create a new network</p>
        </>
      )}
    </button>
  );
}
