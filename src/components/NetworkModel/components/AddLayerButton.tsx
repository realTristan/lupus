import PlusSVG from "~/components/svgs/Plus";
import { createLayer } from "~/lib/projects/project/networks/networkLayer/createLayer";
import { MAX_NETWORK_LAYERS } from "~/lib/constants";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

/**
 * Add layer button props
 */
interface Props {
  project: ObjectState<Project>;
  network: Network;
}

/**
 * Add layer button
 * @param {Props} props Props
 * @param {Project} props.project The project
 * @param {Network} props.network The network
 * @returns JSX.Element
 */
export default function AddLayerButton(props: Props): JSX.Element {
  const HAS_REACHED_MAX_LAYERS: boolean =
    props.network.layers.length >= MAX_NETWORK_LAYERS;

  return (
    <button
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
      disabled={HAS_REACHED_MAX_LAYERS}
      onClick={() =>
        createLayer({
          project: props.project,
          network: props.network,
        })
      }
    >
      <PlusSVG className="fill-slate-950" />{" "}
      <p>{HAS_REACHED_MAX_LAYERS ? "Max layers reached" : "Add Layer"}</p>
    </button>
  );
}
