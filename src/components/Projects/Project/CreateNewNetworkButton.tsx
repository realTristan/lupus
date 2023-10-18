import { MAX_NETWORKS } from "~/lib/constants";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";
import { createNewNetwork } from "../../../lib/projects/project/createNewNetwork";
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
  const networks: Network[] = props.project.value.networks ?? [];
  const MAX_NETWORKS_REACHED: boolean = networks.length >= MAX_NETWORKS;

  return (
    <button
      disabled={MAX_NETWORKS_REACHED}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-5 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
      onClick={async () =>
        await createNewNetwork({
          project: props.project,
        })
      }
    >
      {MAX_NETWORKS_REACHED ? (
        <p>Maximum networks limit reached</p>
      ) : (
        <>
          <PlusSVG className="fill-slate-950" /> <p>Create a new network</p>
        </>
      )}
    </button>
  );
}
