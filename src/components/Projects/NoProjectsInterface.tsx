import Link from "next/link";
import ExternalSVG from "../svgs/External";

export default function NoProjectsInterface(): JSX.Element {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center">
      <p className="text-7xl font-black ">Nothing&#39;s here.</p>
      <p className="mt-3 text-sm font-normal">
        You don&#39;t have any projects yet. Create one to get started.
      </p>
      <Link
        href="/projects/new"
        className="mt-5 flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-4 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
      >
        <ExternalSVG className="fill-slate-950" /> <p>Get started</p>
      </Link>
    </div>
  );
}
