import { genId } from "~/lib/crypto";
import { type ObjectState } from "~/lib/state";
import { type Network, type NetworkLayer } from "~/lib/types";
import PlusSVG from "./svgs/Plus";
import CopySVG from "./svgs/Copy";
import TrashcanSVG from "./svgs/Trashcan";
import { MAX_NETWORK_LAYERS } from "~/lib/constants";

/**
 * Network Model Component
 * @returns {JSX.Element} JSX.Element
 */
export default function NetworkModel(props: {
  networks: ObjectState<Network[]>;
  network: Network;
}): JSX.Element {
  const onClick = () => {
    if (props.network.layers.length >= MAX_NETWORK_LAYERS) {
      return;
    }

    const newNetwork = props.network;
    newNetwork.layers.push({
      id: genId(),
      type: "dense",
      neurons: 1,
      shape: 1,
    });

    const newNetworks = props.networks.value;
    newNetworks.push(newNetwork);

    props.networks.set(newNetworks);
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
      {props.network.layers.map((layer: NetworkLayer, i: number) => {
        const key: string = genId();

        return (
          <NetworkLayer
            networks={props.networks}
            network={props.network}
            layer={layer}
            index={i}
            key={key}
          />
        );
      })}

      <div className="flex flex-row gap-4">
        <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          <CopySVG className="fill-slate-950" /> <p>Copy Code</p>
        </button>

        {props.network.layers.length < MAX_NETWORK_LAYERS ? (
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
    </div>
  );
}

/**
 * Clean a string
 * @param s String to clean
 * @returns {string} Cleaned string
 */
const clean = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Network layer props
 */
interface NetworkLayerProps {
  networks: ObjectState<Network[]>;
  network: Network;
  layer: NetworkLayer;
  index: number;
}

/**
 * Network layer component
 * @param props Network layer props
 * @returns JSX.Element
 */
function NetworkLayer(props: NetworkLayerProps): JSX.Element {
  const onBlur = (e: any, key: string): void => {
    const value: string = e.currentTarget.value || "1";
    const newNetwork = props.network;

    // @ts-ignore
    newNetwork.layers[props.index][key] = parseInt(value);

    const newNetworks = props.networks.value;
    newNetworks.push(newNetwork);

    props.networks.set(newNetworks);
  };

  const deleteLayer = async () => {
    const newNetwork = props.network;
    newNetwork.layers.splice(props.index, 1);

    const newNetworks = props.networks.value;
    newNetworks.push(newNetwork);

    props.networks.set(newNetworks);
  };

  return (
    <span className="flex w-full flex-col items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
      <p>
        Layer {props.index + 1}: {clean(props.layer.type)}
      </p>

      <div className="flex w-full flex-col items-start justify-start gap-2 lg:flex-row">
        <span className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-4 py-2 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          <p>Neurons: </p>
          <input
            type="number"
            className="bg-transparent px-2 py-1"
            defaultValue={props.layer.neurons}
            onBlur={(e) => onBlur(e, "neurons")}
          />
        </span>
        <span className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-4 py-2 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          <p>Input Shape: </p>
          <input
            type="number"
            className="bg-transparent px-2 py-1"
            defaultValue={props.layer.shape}
            onBlur={(e) => onBlur(e, "shape")}
          />
        </span>

        {/* Button to delete the current layer */}
        {props.index >= 1 && (
          <button
            onClick={async () => await deleteLayer()}
            className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-5 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <TrashcanSVG className="h-5 w-5 fill-slate-950" /> <p>Delete</p>
          </button>
        )}
      </div>
    </span>
  );
}
