import CrossSVG from "~/components/svgs/Cross";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

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
  return (
    <button
      onClick={() => {
        if (props.activeNetwork.id === props.network.id) {
          return;
        }

        const newNetworks = props.project.value.networks.filter(
          (network: Network) => network.id !== props.network.id,
        );

        props.project.set({
          ...props.project.value,
          networks: newNetworks,
        });
      }}
      disabled={props.activeNetwork.id === props.network.id}
      className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-4 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
    >
      <CrossSVG className="h-3 w-3 fill-slate-950" /> <p>Delete</p>
    </button>
  );
}
