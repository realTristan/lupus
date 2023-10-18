import { type ObjectState } from "~/lib/state";
import { type Project, type Network, type NetLayer } from "~/lib/types";
import CopySVG from "../SvgComponents/Copy";
import { useState } from "react";
import NetworkLayer from "./NetworkLayer/NetworkLayer";
import AddLayerButton from "./AddLayerButton";
import DeleteNetworkButton from "./DeleteNetworkButton";
import SetActiveNetworkButton from "./SetActiveNetworkButton";
import NetworkSVG from "../SvgComponents/Network";
import SlateBorderButton from "../SlateBorderButton";

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
      className="flex w-full flex-col gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-5"
    >
      <div className="flex flex-row justify-between">
        <div className="w-full">
          <div className="flex flex-row items-center justify-center gap-2">
            <NetworkSVG className="-mt-px h-7 w-7 fill-slate-950" />
            <h1 className="w-full text-xl font-extrabold">
              {props.network.name}
            </h1>
          </div>
          <p className="w-full text-sm font-thin">
            {props.network.description}
          </p>
        </div>
        <div className="flex w-full flex-row justify-end gap-2">
          <SetActiveNetworkButton {...props} />

          <SlateBorderButton onClick={() => setHidden(!hidden)}>
            {hidden ? "Show" : "Hide"}
          </SlateBorderButton>

          <DeleteNetworkButton
            activeNetwork={props.activeNetwork.value}
            network={props.network}
            project={props.project}
          />
        </div>
      </div>

      <div className={hidden ? "hidden" : "flex flex-col gap-2"}>
        {/* Network type */}
        <span className="rounded-md border-2 border-slate-100 bg-white px-4 py-3 text-left text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50">
          Network: tf.Sequential
        </span>

        {/* Loss function and optimizer */}
        <span className="rounded-md border-2 border-slate-100 bg-white px-4 py-3 text-left text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50">
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
          <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50">
            <CopySVG className="mt-1 h-5 w-5 fill-slate-950" /> <p>Copy Code</p>
          </button>

          <AddLayerButton {...props} />
        </div>
      </div>
    </div>
  );
}
