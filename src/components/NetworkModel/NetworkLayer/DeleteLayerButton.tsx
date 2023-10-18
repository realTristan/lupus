import CrossSVG from "~/components/Svgs/Cross";
import { deleteLayer } from "~/lib/projects/project/networks/networkLayer/deleteLayer";
import { type ObjectState } from "~/lib/state";
import { type Network, type Project } from "~/lib/types";

/**
 * Delete layer button props
 */
interface Props {
  project: ObjectState<Project>;
  network: Network;
  index: number;
}

/**
 * Delete layer button
 * @param {Props} props Props
 * @param {Project} props.project The project
 * @param {Network} props.network The network
 * @param {number} props.index The index
 * @returns JSX.Element
 */
export default function DeleteLayerButton(props: Props): JSX.Element {
  return (
    <button
      onClick={() =>
        deleteLayer({
          project: props.project,
          network: props.network,
          index: props.index,
        })
      }
      className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-5 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <CrossSVG className="h-3 w-3 fill-slate-950" />
    </button>
  );
}
