import SlateBorderButton from "../SlateBorderButton";
import ExternalSVG from "../SvgComponents/External";

/**
 * Export CSV Button
 * @returns JSX.Element
 */
export default function ExportCSVButton(): JSX.Element {
  return (
    <SlateBorderButton>
      <ExternalSVG className="h-4 w-4 fill-slate-950" /> Export
    </SlateBorderButton>
  );
}
