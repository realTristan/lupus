import { genId } from "~/lib/crypto";
import { type ObjectState } from "~/lib/state";
import { type Project, type Network, type NetworkLayer } from "~/lib/types";
import PlusSVG from "./svgs/Plus";
import TrashcanSVG from "./svgs/Trashcan";
import { MAX_NETWORK_LAYERS } from "~/lib/constants";
import CopySVG from "./svgs/Copy";

/**
 * Clean a string
 * @param s String to clean
 * @returns {string} Cleaned string
 */
const clean = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Network model props
 */
interface NetworkModelProps {
  project: ObjectState<Project>;
  activeNetwork: ObjectState<Network>;
  network: Network;
}

/**
 * Network Model Component
 * @returns {JSX.Element} JSX.Element
 */
export default function NetworkModel(props: NetworkModelProps): JSX.Element {
  /**
   * Add a new network layer
   * @returns {Promise<void>}
   * @async
   */
  const addNetworkLayer = async (): Promise<void> => {
    if (props.network.layers.length >= MAX_NETWORK_LAYERS) {
      return;
    }

    const networkLayerId: string = await genId();
    const newNetwork = {
      ...props.network,
      layers: [
        ...props.network.layers,
        {
          id: networkLayerId,
          type: "dense",
          neurons: 1,
          shape: 1,
        },
      ],
    };

    props.project.set({
      ...props.project.value,
      networks: props.project.value.networks?.map((network: Network) =>
        network.id === newNetwork.id ? newNetwork : network,
      ),
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border-2 border-slate-100 bg-white px-10 py-7">
      <div className="flex flex-row justify-between">
        <div className="w-full">
          <h1 className="w-full text-5xl font-extrabold">
            {props.network.name}
          </h1>
          <p className="w-full text-xl font-thin">
            {props.network.description}
          </p>
        </div>
        <button
          disabled={props.network === props.activeNetwork.value}
          onClick={() => props.activeNetwork.set(props.network)}
          className="flex flex-row items-center justify-center gap-4 rounded-md border-2 border-slate-100 bg-white px-10 py-7 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
        >
          <p>
            {props.network == props.activeNetwork.value
              ? "Already active"
              : "Set as active"}
          </p>
        </button>
      </div>

      {/* Network type */}
      <span className="flex w-full flex-row items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
        Network: tf.Sequential
      </span>

      {/* Loss function and optimizer */}
      <span className="flex w-full flex-row items-start gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-left text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50">
        Loss Function: MSE <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&#x2192; Optimizer: Adam
      </span>

      {/* Map the layers */}
      {props.network.layers?.map((layer: NetworkLayer, i: number) => {
        return (
          <NetworkLayer
            project={props.project}
            network={props.network}
            layer={layer}
            index={i}
            key={layer.id}
          />
        );
      })}

      <div className="flex flex-row gap-4">
        {/* Button to copy the code */}
        <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          <CopySVG className="fill-slate-950" /> <p>Copy Code</p>
        </button>

        {/* Button to add a new layer */}
        <button
          disabled={props.network.layers.length >= MAX_NETWORK_LAYERS}
          onClick={() => addNetworkLayer()}
          className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
        >
          <PlusSVG className="fill-slate-950" />{" "}
          <p>
            {props.network.layers.length >= MAX_NETWORK_LAYERS
              ? "Max layers reached"
              : "Add Layer"}
          </p>
        </button>
      </div>
    </div>
  );
}

/**
 * Network layer props
 */
interface NetworkLayerProps {
  project: ObjectState<Project>;
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
  /**
   * On row change event
   * @param e Event
   * @param key Key
   */
  const onRowChangeBlur = (e: any, key: string): void => {
    const value = e.target.value;
    const newNetwork = {
      ...props.network,
      layers: props.network.layers?.map((layer: NetworkLayer, i: number) => {
        if (i === props.index) {
          return {
            ...layer,
            [key]: value,
          };
        }

        return layer;
      }),
    };

    props.project.set({
      ...props.project.value,
      networks: props.project.value.networks?.map((network: Network) =>
        network.id === newNetwork.id ? newNetwork : network,
      ),
    });
  };

  /**
   * Delete the current layer
   * @returns {void}
   */
  const deleteLayer = (): void => {
    const newNetwork = {
      ...props.network,
      layers: props.network.layers.filter(
        (_: NetworkLayer, i: number) => i !== props.index,
      ),
    };

    props.project.set({
      ...props.project.value,
      networks: props.project.value.networks?.map((network: Network) =>
        network.id === newNetwork.id ? newNetwork : network,
      ),
    });
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
            onBlur={(e) => onRowChangeBlur(e, "neurons")}
          />
        </span>
        <span className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-4 py-2 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          <p>Input Shape: </p>
          <input
            type="number"
            className="bg-transparent px-2 py-1"
            defaultValue={props.layer.shape}
            onBlur={(e) => onRowChangeBlur(e, "shape")}
          />
        </span>

        {/* Button to delete the current layer */}
        {props.index >= 1 && (
          <button
            onClick={() => deleteLayer()}
            className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-5 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <TrashcanSVG className="h-5 w-5 fill-slate-950" /> <p>Delete</p>
          </button>
        )}
      </div>
    </span>
  );
}
