import { type TableValue } from "~/lib/types";
import CrossSVG from "../SvgComponents/Cross";

/**
 * Remove row button props
 * @interface Props
 * @property {number} id The id
 * @property {TableValue[]} values The values
 * @property {Function} setValues Set the values
 */
interface Props {
  id: string;
  values: TableValue[];
  setValues: (values: TableValue[]) => void;
}

/**
 * Remove row button component
 * @param props Remove row button props
 * @param {number} props.id The id
 * @param {TableValue[]} props.values The values
 * @param {Function} props.setValues Set the values
 * @returns JSX.Element
 */
export default function RemoveRowButton(props: Props): JSX.Element {
  const onClick = () => {
    props.setValues(props.values.filter((v: TableValue) => v.id !== props.id));
  };

  return (
    <td
      onClick={() => onClick()}
      className="cursor-pointer border-2 border-slate-100 px-3 py-3 text-sm hover:bg-slate-50"
    >
      <div className="flex flex-row items-center justify-center gap-2">
        <CrossSVG className="h-3 w-3 fill-slate-950" /> <p>Remove</p>
      </div>
    </td>
  );
}
