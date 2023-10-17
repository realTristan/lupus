import { type ObjectState } from "~/lib/state";
import { updateLayerRow } from "../lib/updateLayerRow";
import { type NetLayer, type Network, type Project } from "~/lib/types";

/**
 * Shape input props
 */
interface Props {
  project: ObjectState<Project>;
  network: Network;
  layer: NetLayer;
  index: number;
}

/**
 * Shape input component
 * @param {Props} props Props
 * @param {Project} props.project The project
 * @param {Network} props.network The network
 * @param {NetLayer} props.layer The layer
 * @param {number} props.index The index
 * @returns JSX.Element
 */
export default function ShapeInput(props: Props): JSX.Element {
  return (
    <span className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-4 py-2 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
      <p>Input Shape: </p>
      <input
        type="number"
        className="bg-transparent px-2 py-1"
        defaultValue={props.layer.shape}
        onBlur={(e) =>
          updateLayerRow({
            event: e,
            project: props.project,
            network: props.network,
            index: props.index,
            key: "shape",
          })
        }
      />
    </span>
  );
}
