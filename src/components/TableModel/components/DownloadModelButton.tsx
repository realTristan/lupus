import { type Sequential } from "@tensorflow/tfjs";
import downloadModel from "../lib/downloadModel";

interface Props {
  model: Sequential;
}

/**
 * Download model button component
 * @returns JSX.Element
 * @memberof Table
 */
export default function DownloadModelButton(props: Props): JSX.Element {
  return (
    <button
      disabled={!props.model}
      onClick={async () => await downloadModel(props.model)}
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-base font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
    >
      <span>Download Model</span>
    </button>
  );
}
