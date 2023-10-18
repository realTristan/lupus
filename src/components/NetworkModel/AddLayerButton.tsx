import PlusSVG from "~/components/SvgComponents/Plus";
import { createLayer } from "~/lib/projects/project/networks/networkLayer/createLayer";
import { MAX_NETWORK_LAYERS } from "~/lib/constants";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";
import SlateBorderButton from "../SlateBorderButton";

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
    <SlateBorderButton
      disabled={HAS_REACHED_MAX_LAYERS}
      onClick={() =>
        createLayer({
          project: props.project,
          network: props.network,
        })
      }
      className="w-full border-0 bg-blue-500 text-white hover:bg-blue-500/80"
    >
      <PlusSVG className="h-5 w-5 fill-white" />
      <span>Layer</span>
    </SlateBorderButton>
  );
}
