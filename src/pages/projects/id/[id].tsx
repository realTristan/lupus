import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/svgs/Loading";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { type Network, type TableValue } from "~/lib/types";
import TableModel from "~/components/TableModel";
import { genId } from "~/lib/crypto";
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
  const { data, refetch } = api.projects.getProject.useQuery(
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
   * Store the networks
   */
  const networks = new ObjectState<Network[]>([]);
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
      refetch().then((res) => {
        if (!res.data?.result) return;

        networks.set(res.data.result.networks);
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

        <main className="mt-24 flex min-h-screen flex-col items-start gap-10 p-14">
          {/* Project title and description */}
          <div>
            <h1 className="text-6xl font-black">{data.result.name}</h1>
            <p className="mt-2 text-2xl">{data.result.description}</p>
          </div>

          {/* Map the networks */}
          {networks.value.map((network: Network) => {
            return (
              <div key={network.id} className="w-full">
                <div className="flex flex-row justify-between">
                  <div>
                    <h1 className="w-fit text-5xl font-thin">{network.name}</h1>
                    <p className="mt-2 text-2xl">{network.description}</p>
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

                <NetworkModel networks={networks} network={network} />
              </div>
            );
          })}

          {/* Map the tables */}
          {data.result.tables?.map((table) => {
            const values = convertLinearTableValuesToObjects(table.values);

            return (
              <div key={table.id} className="w-full">
                <h1 className="w-fit text-5xl font-thin">{table.name}</h1>
                <p className="mt-2 text-2xl">{table.description}</p>
                <div className="m-3 w-full">
                  <TableModel
                    headers={table.headers}
                    values={values}
                    layers={activeNetwork?.layers ?? []}
                  />
                </div>
              </div>
            );
          })}

          <h1 className="w-fit text-5xl font-thin">Model Builds</h1>
        </main>
      </>
    );
  }

  // If the user isn't logged in, return a loading component
  return <LoadingCenter />;
}

/**
 * Convert a linear array of numbers to an array of objects
 * @param {number[]} nums The linear array of numbers
 * @returns {Promise<{id: string, values: number[]}[]>} The array of objects
 * @async
 */
function convertLinearTableValuesToObjects(nums: number[]): TableValue[] {
  const result: TableValue[] = [];

  for (let i = 0; i < nums.length; i += 2) {
    const values: number[] = [nums[i] ?? 0, nums[i + 1] ?? 0];
    const id: string = genId();

    result.push({
      id,
      values,
    });
  }

  return result;
}
