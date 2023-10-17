import TrashcanSVG from "~/components/svgs/Trashcan";
import { deleteLayer } from "../lib/deleteLayer";
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
      className="flex w-fit flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-5 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <TrashcanSVG className="h-5 w-5 fill-slate-950" /> <p>Delete</p>
    </button>
  );
}
