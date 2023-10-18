import PlusSVG from "~/components/svgs/Plus";
import { MAX_ROWS } from "~/lib/constants";
import { genId } from "~/lib/crypto";
import { type TableValue } from "~/lib/types";

/**
 * Add row button parameters
 * @interface Parameters
 * @property {Function} setTestData Set the test data
 */
interface Parameters {
  values: TableValue[];
  setValues: (values: TableValue[]) => void;
}

/**
 * Add row button component
 * @returns JSX.Element
 */
export default function AddRowButton(params: Parameters): JSX.Element {
  /**
   * On click event
   * @returns Promise<void>
   */
  const addRow = async (): Promise<void> => {
    if (params.values.length >= MAX_ROWS) {
      return;
    }

    params.setValues([
      ...params.values,
      {
        id: await genId(),
        values: [0, 0],
      },
    ]);

    console.log(params.values);
  };

  return (
    <button
      disabled={params.values.length >= MAX_ROWS}
      onClick={async () => await addRow()}
      className="flex w-full flex-row items-center justify-center gap-1 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50 disabled:opacity-50"
    >
      <PlusSVG className="h-5 w-5 fill-slate-950" />
      <span>Row</span>
    </button>
  );
}
