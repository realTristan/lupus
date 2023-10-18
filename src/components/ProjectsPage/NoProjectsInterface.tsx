import Link from "next/link";
import ExternalSVG from "../SvgComponents/External";

export default function NoProjectsInterface(): JSX.Element {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center">
      <p className="text-7xl font-black ">Nothing&#39;s here.</p>
      <p className="mt-3 text-sm font-normal">
        You don&#39;t have any projects yet. Create one to get started.
      </p>
      <Link
        href="/projects/new"
        className="mt-6 flex flex-row items-center justify-center gap-2 rounded-md bg-blue-500 px-7 py-3 text-sm font-normal tracking-wider text-white hover:bg-blue-500/80"
      >
        <ExternalSVG className="fill-white" /> <p>Get started</p>
      </Link>
    </div>
  );
}
