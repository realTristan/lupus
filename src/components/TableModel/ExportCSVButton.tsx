/**
 * Export CSV Button
 * @returns JSX.Element
 */
export default function ExportCSVButton(): JSX.Element {
  return (
    <button className="flex w-full flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-3 text-center text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50">
      <span>Export CSV</span>
    </button>
  );
}
