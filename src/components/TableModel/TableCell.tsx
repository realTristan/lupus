import { type TableValue } from "~/lib/types";

/**
 * Table cell props
 * @interface Props
 * @property {TableValue} row The row
 * @property {number[]} value The value
 * @property {TableValue[]} values The values
 * @property {Function} setValues Set the values
 * @property {number} index The index
 */
interface Props {
  row: TableValue;
  value: number[];
  values: TableValue[];
  setValues: (values: TableValue[]) => void;
  index: number;
}

/**
 * Table data component
 * @param props Table data props
 * @param {TableValue} props.row The row
 * @param {number[]} props.value The value
 * @param {TableValue[]} props.values The values
 * @param {Function} props.setValues Set the values
 * @param {number} props.index The index
 * @returns JSX.Element
 */
export default function TableCell(props: Props): JSX.Element {
  const onBlur = (e: React.FocusEvent<HTMLTableDataCellElement>): void => {
    const newValues = props.values.map((d: TableValue) => {
      if (d.id === props.row.id) {
        d.values[props.index] = parseInt(e.currentTarget.textContent ?? "");
      }

      return d;
    });

    props.setValues(newValues);
  };

  return (
    <td
      className="border-2 border-slate-100 p-4"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={(e) => onBlur(e)}
    >
      {props.value}
    </td>
  );
}
