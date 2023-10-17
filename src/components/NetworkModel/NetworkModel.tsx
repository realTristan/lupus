import { type ObjectState } from "~/lib/state";
import { type Project, type Network, type NetLayer } from "~/lib/types";
import CopySVG from "../svgs/Copy";
import { useState } from "react";
import NetworkLayer from "./components/NetworkLayer/NetworkLayer";
import AddLayerButton from "./components/AddLayerButton";
import DeleteNetworkButton from "./components/DeleteNetworkButton";
import SetAsActiveNetworkButton from "./components/SetAsActiveNetworkButton";

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
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <div
      id={props.network.id}
      className="flex w-full flex-col gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-7"
    >
      <div className="flex flex-row justify-between">
        <div className="w-full">
          {/* Network name */}
          <h1 className="w-full text-5xl font-extrabold">
            {props.network.name}
          </h1>

          {/* Network description */}
          <p className="w-full text-xl font-thin">
            {props.network.description}
          </p>
        </div>
        <div className="flex w-full flex-row justify-end gap-2">
          <SetAsActiveNetworkButton {...props} />
          {/* Button to hide the network */}
          <button
            onClick={() => setHidden(!hidden)}
            className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
          >
            <p>{hidden ? "Show network" : "Hide network"}</p>
          </button>
          {/* Button to delete the network */}
          <DeleteNetworkButton
            activeNetwork={props.activeNetwork.value}
            network={props.network}
            project={props.project}
          />{" "}
        </div>
      </div>

      <div className={hidden ? "hidden" : "flex flex-col gap-2"}>
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
        {props.network.layers?.map((layer: NetLayer, i: number) => (
          <NetworkLayer
            project={props.project}
            network={props.network}
            layer={layer}
            index={i}
            key={layer.id}
          />
        ))}

        <div className="flex flex-row gap-2">
          {/* Button to copy the code */}
          <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50">
            <CopySVG className="fill-slate-950" /> <p>Copy Code</p>
          </button>

          <AddLayerButton {...props} />
        </div>
      </div>
    </div>
  );
}
