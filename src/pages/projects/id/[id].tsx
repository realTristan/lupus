import { useRouter, type NextRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/svgs/Loading";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { type Table, type Network, type Project } from "~/lib/types";
import TableModel from "~/components/TableModel/TableModel";
import { ObjectState } from "~/lib/state";
import NetworkModel from "~/components/NetworkModel/NetworkModel";
import CreateNewNetworkButton from "~/components/Projects/Project/CreateNewNetworkButton";
import { CreateNewTableButton } from "~/components/Projects/Project/CreateNewTableButton";
import SideMenu from "~/components/Projects/Project/SideMenu";
import { trpcGetProject } from "~/lib/trpc/getProject";

/**
 * Project page
 * @returns {JSX.Element} JSX.Element
 */
export default function ProjectPage(): JSX.Element {
  // Get the users session to check if they're logged in.
  const { data: session, status } = useSession();

  // Next router for redirecting to the login endpoint if the
  // user isn't logged in and to get the project id.
  const router: NextRouter = useRouter();

  // Get the project data via trpc
  const project = new ObjectState<Project>({
    id: router.query.id as string,
  } as Project);

  const { data: projectData, getProject } = trpcGetProject(
    session?.user.secret ?? "",
    project.value.id,
  );

  // Update the project settings to the database

  // Update the project tables builds to the database

  // Add a new network to the database

  // Add a new network layer to the database

  // Update the project network layers to the database

  // Add a new table to the database

  // Update table data/headers to the database

  // Store the active network in a state
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
    if (!project.updated || !projectData?.result) {
      getProject().then((res) => {
        const result = res.data?.result;
        if (!result) return;

        const networks = result.networks;
        if (!networks) return;

        const network = networks.at(0) ?? ({} as Network);
        activeNetwork.set(network);
        project.set(result);
      });

      return <LoadingCenter />;
    }

    // Return the jsx
    return (
      <>
        <Head>
          <title>{project.value.name} | arcai</title>
        </Head>

        <Navbar />
        <SideMenu project={project.value} activeNetwork={activeNetwork} />

        {/* The main content of the page */}
        <main className="flex min-h-screen flex-col gap-7 p-14 pl-80 pt-52">
          {/* Project title and description */}
          <div className="text-center">
            <h1 className="text-6xl font-black">{project.value.name}</h1>
            <p className="mt-2 text-2xl font-thin">
              {project.value.description}
            </p>
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
          {project.value.tables?.map((table: Table) => {
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
