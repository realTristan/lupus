import { MAX_ROWS } from "~/lib/constants";
import { genId } from "~/lib/crypto";
import { type TableValue } from "~/lib/types";

/**
 * Import CSV dialog props
 * @interface Props
 * @property {Function} setValues Set the new values
 */
interface Props {
  setValues: (values: TableValue[]) => void;
}

/**
 * Import CSV dialog component
 * @returns {JSX.Element} JSX.Element
 */
export default function ImportCSVDialog(props: Props): JSX.Element {
  return (
    <>
      <label
        htmlFor="import_csv_input"
        className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        Import CSV
      </label>
      <input
        id="import_csv_input"
        className="hidden"
        type="file"
        accept=".csv"
        onChange={async (e) =>
          await onChange({ e, setValues: props.setValues })
        }
      />
    </>
  );
}

/**
 * On change parameters
 * @interface OnChangeParameters
 * @property {React.ChangeEvent<HTMLInputElement>} e Event
 * @property {Function} setValues Set the new values
 */
interface OnChangeParameters {
  e: React.ChangeEvent<HTMLInputElement>;
  setValues: (values: TableValue[]) => void;
}

/**
 * On change event
 * @param {OnChangeParameters} params On change parameters
 * @returns {Promise<void>}
 */
async function onChange(params: OnChangeParameters): Promise<void> {
  const file = params.e.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const result = e.target?.result;
    if (!result) {
      return;
    }

    const values = result
      .toString()
      .split("\n")
      .map((row: string) => row.split(","))
      .slice(1);

    if (values.length > MAX_ROWS) {
      return;
    }

    // convert the values to objects
    const newValues: TableValue[] = [];
    for (const value of values) {
      const id = await genId();
      const values = value.map((v) => Number(v));

      newValues.push({
        id,
        values,
      });
    }

    params.setValues(newValues);
  };

  reader.readAsText(file);
}
