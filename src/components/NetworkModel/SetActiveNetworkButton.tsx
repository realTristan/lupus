import { type ObjectState } from "~/lib/state";
import { type Network } from "~/lib/types";

/**
 * Set as active network button props
 */
interface Props {
  network: Network;
  activeNetwork: ObjectState<Network>;
}

/**
 * Set as active network button
 * @param {Props} props Props
 * @param {Network} props.network The network
 * @param {ObjectState<Network>} props.activeNetwork The active network
 * @returns JSX.Element
 */
export default function SetAsActiveNetworkButton(props: Props): JSX.Element {
  return (
    <button
      disabled={props.network.id === props.activeNetwork.value.id}
      onClick={() => props.activeNetwork.set(props.network)}
      className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
    >
      <p>
        {props.network.id == props.activeNetwork.value.id
          ? "Activated"
          : "Activate"}
      </p>
    </button>
  );
}
