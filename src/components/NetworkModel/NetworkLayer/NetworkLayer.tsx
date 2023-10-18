import { type Network, type Project, type NetLayer } from "~/lib/types";
import { type ObjectState } from "~/lib/state";
import NeuronsInput from "./NeuronsInput";
import ShapeInput from "./ShapeInput";
import DeleteLayerButton from "./DeleteLayerButton";
import { clean } from "../../../utils/clean";

/**
 * Network layer props
 */
interface NetLayerProps {
  project: ObjectState<Project>;
  network: Network;
  layer: NetLayer;
  index: number;
}

/**
 * Network layer component
 * @param props Network layer props
 * @returns JSX.Element
 */
export default function NetLayer(props: NetLayerProps): JSX.Element {
  const HAS_ATLEAST_TWO_LAYERS: boolean = props.network.layers.length > 1;
  const layerType: string = clean(props.layer.type);
  const layerNum: number = props.index + 1;

  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-4 py-3 text-left text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
      Layer {layerNum}: {layerType}
      <div className="flex w-full flex-col justify-start gap-2 lg:flex-row">
        <NeuronsInput {...props} />
        <ShapeInput {...props} />

        {/* Button to delete the current layer */}
        {HAS_ATLEAST_TWO_LAYERS && <DeleteLayerButton {...props} />}
      </div>
    </div>
  );
}
