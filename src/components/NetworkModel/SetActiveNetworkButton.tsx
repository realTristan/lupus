import { type ObjectState } from "~/lib/state";
import { type Network } from "~/lib/types";
import SlateBorderButton from "../SlateBorderButton";

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
    <SlateBorderButton
      disabled={props.network.id === props.activeNetwork.value.id}
      onClick={() => props.activeNetwork.set(props.network)}
    >
      {props.network.id == props.activeNetwork.value.id
        ? "Activated"
        : "Activate"}
    </SlateBorderButton>
  );
}
