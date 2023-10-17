import { MAX_NETWORKS } from "~/lib/constants";
import { type ObjectState } from "~/lib/state";
import { type Project } from "~/lib/types";
import { createNewNetwork } from "./lib/createNewNetwork";
import PlusSVG from "~/components/svgs/Plus";

interface Props {
  project: ObjectState<Project>;
}

/**
 * Create a new network button
 * @param {Object} props Props
 * @returns {JSX.Element} JSX.Element
 */
export default function CreateNewNetworkButton(props: Props): JSX.Element {
  return (
    <button
      disabled={props.project.value.networks.length >= MAX_NETWORKS}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
      onClick={async () =>
        createNewNetwork({
          project: props.project,
        })
      }
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
