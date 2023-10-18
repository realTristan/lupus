import { type Sequential } from "@tensorflow/tfjs";
import { downloadModel } from "../../lib/projects/project/tables/downloadModel";
import SlateBorderButton from "../SlateBorderButton";
import ExternalSVG from "../SvgComponents/External";

/**
 * Download model button props
 * @interface Props
 * @property {Sequential} model Model
 */
interface Props {
  model: Sequential | null;
}

/**
 * Download model button component
 * @returns JSX.Element
 * @memberof Table
 */
export default function DownloadModelButton(props: Props): JSX.Element {
  const onClick = async () => {
    if (!props.model) return;
    await downloadModel(props.model);
  };

  return (
    <SlateBorderButton
      onClick={onClick}
      disabled={!props.model}
      className="border-0 bg-blue-500 px-6 text-white hover:bg-blue-500/80"
    >
      <ExternalSVG className="h-5 w-5 fill-white" /> <p>Download</p>
    </SlateBorderButton>
  );
}
