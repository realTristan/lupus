import CrossSVG from "~/components/SvgComponents/Cross";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";
import SlateBorderButton from "../SlateBorderButton";

/**
 * Delete network button props
 */
interface Props {
  activeNetwork: Network;
  network: Network;
  project: ObjectState<Project>;
}

/**
 * Delete network button
 * @param {Props} props Props
 * @param {Network} props.activeNetwork The active network
 * @param {Network} props.network The network
 * @param {Project} props.project The project
 * @returns JSX.Element
 */
export default function DeleteNetworkButton(props: Props): JSX.Element {
  const deleteNetwork = () => {
    const newNetworks = props.project.value.networks?.filter(
      (network: Network) => network.id !== props.network.id,
    );

    props.project.set({
      ...props.project.value,
      networks: newNetworks,
    });
  };

  return (
    <SlateBorderButton
      onClick={() => deleteNetwork()}
      disabled={props.activeNetwork.id === props.network.id}
    >
      <CrossSVG className="h-3 w-3 fill-slate-950" /> <p>Delete</p>
    </SlateBorderButton>
  );
}
