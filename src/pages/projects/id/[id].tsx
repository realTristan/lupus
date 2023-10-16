import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/svgs/Loading";
import TableModel from "~/components/TableModel";
import Head from "next/head";
import {
  TEST_PROJECT_TABLE_DATA,
  TEST_PROJECT_TABLE_HEADERS,
} from "~/lib/constants";
import Navbar from "~/components/Navbar";
import PlusSVG from "~/components/svgs/Plus";
import { type Layer } from "~/lib/types";
import { ObjectState } from "~/lib/state";

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
   * Store the network layers
   */
  const layers = new ObjectState<Layer[]>([
    {
      type: "dense",
      neurons: 1,
      inputShape: 1,
    },
  ]);

  // If the user isn't logged in, redirect to the login page
  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  // If the user is logged in, get the projects
  if (status === "authenticated") {
    // Make sure that the user has a secret
    if (!session?.user.secret) return <></>;

    // If not already fetched data
    if (!data) refetch();
    if (!data?.result) return <LoadingCenter />;

    // Return the jsx
    return (
      <>
        <Head>
          <title>{data.result.name} | arcai</title>
        </Head>

        <Navbar />

        <main className="mt-24 flex min-h-screen flex-col items-start gap-10 p-14">
          <div>
            <h1 className="text-6xl font-black">{data.result.name}</h1>
            <p className="mt-2 text-2xl">{data.result.description}</p>
          </div>
          <div className="w-full">
            <h1 className="w-fit text-5xl font-thin" contentEditable={true}>
              Network 1
            </h1>
            <NetworkModel layers={layers} />
          </div>
          <div className="w-full">
            <h1 className="w-fit text-5xl font-thin" contentEditable={true}>
              Table 1
            </h1>
            <TableModel
              className="m-7"
              headers={TEST_PROJECT_TABLE_HEADERS}
              data={TEST_PROJECT_TABLE_DATA}
              layers={layers.value}
            />
          </div>
        </main>
      </>
    );
  }

  // If the user isn't logged in, return a loading component
  return <LoadingCenter />;
}

/**
 * Network Model Component
 * @returns {JSX.Element} JSX.Element
 */
function NetworkModel(props: { layers: ObjectState<Layer[]> }): JSX.Element {
  const clean = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const onClick = () => {
    if (props.layers.value.length >= 3) {
      return;
    }

    props.layers.set([
      ...props.layers.value,
      {
        type: "dense",
        neurons: 1,
        inputShape: 1,
      },
    ]);
  };

  return (
    <div className="mx-3 my-5 flex w-full flex-col gap-4">
      <span className="flex w-full flex-row items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
        Network: tf.Sequential
      </span>
      <span className="flex w-full flex-row items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
        Loss Function: MSE <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&#x2192; Optimizer: Adam
      </span>
      {props.layers.value.map((layer, i) => {
        return (
          <span
            key={i}
            className="flex w-full flex-row items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
          >
            Layer {i + 1}: {clean(layer.type)} <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&#x2192; Neurons: {layer.neurons} <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&#x2192; Input Shape: {layer.inputShape}
          </span>
        );
      })}
      {props.layers.value.length < 3 ? (
        <button
          onClick={() => onClick()}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <PlusSVG className="fill-slate-950" /> <p>Add Layer</p>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
