import PlusSVG from "~/components/Svgs/Plus";

/**
 * Create a new table button
 * @param {Object} props Props
 * @returns {JSX.Element} JSX.Element
 */
export function CreateNewTableButton(): JSX.Element {
  return (
    <button
      className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-3 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      onClick={async () => {
        return;
      }}
    >
      <PlusSVG className="fill-slate-950" /> <p>Create a new table</p>
    </button>
  );
}
