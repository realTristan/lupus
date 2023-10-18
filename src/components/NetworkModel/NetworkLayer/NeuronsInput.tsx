import { type NetLayer, type Network, type Project } from "~/lib/types";
import { updateLayerRow } from "~/lib/projects/project/networks/networkLayer/updateLayerRow";
import { type ObjectState } from "~/lib/state";

/**
 * Neurons input props
 */
interface Props {
  project: ObjectState<Project>;
  network: Network;
  layer: NetLayer;
  index: number;
}

/**
 * Neurons input component
 * @param {Props} props Props
 * @param {Project} props.project The project
 * @param {Network} props.network The network
 * @param {NetLayer} props.layer The layer
 * @param {number} props.index The index
 * @returns JSX.Element
 */
export default function NeuronsInput(props: Props): JSX.Element {
  return (
    <span className="flex flex-row items-center justify-start rounded-md border-2 border-slate-100 bg-white px-4 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50">
      <p>Neurons: </p>
      <input
        type="number"
        className="bg-transparent px-2 py-1"
        defaultValue={props.layer.neurons}
        onBlur={(e) =>
          updateLayerRow({
            event: e,
            project: props.project,
            network: props.network,
            index: props.index,
            key: "neurons",
          })
        }
      />
    </span>
  );
}
