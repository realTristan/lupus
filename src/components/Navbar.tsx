import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import GoogleLogoSmallSVG from "./Svgs/Google";
import PlusSVG from "./Svgs/Plus";
import ExternalSVG from "./Svgs/External";
import { useRouter } from "next/router";
import TableSVG from "./Svgs/Table";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 flex w-screen flex-row justify-between border-b-2 border-slate-200 bg-white p-10">
      <Link href="/" className="group flex flex-col items-start">
        <h1 className="text-xl font-extrabold">
          <mark className="bg-transparent text-4xl font-black">A</mark>rc AI{" "}
          <mark className="bg-transparent text-base font-thin">beta v0.1</mark>
        </h1>
        <span className="h-0.5 w-0 bg-slate-300 duration-300 ease-in-out group-hover:w-12"></span>
      </Link>

      {status !== "authenticated" && (
        <Link
          href="/login?redirect=/projects"
          className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <GoogleLogoSmallSVG className="fill-slate-950" />{" "}
          <p>Sign in with Google</p>
        </Link>
      )}

      {status === "authenticated" && (
        <div className="flex flex-row items-center justify-center gap-4">
          <Link
            href="/projects/new"
            className="flex h-[50px] flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 text-sm tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <PlusSVG className="fill-slate-950" /> <p>New Project</p>
          </Link>

          <Link
            href="/projects"
            className="flex h-[50px] flex-row items-center justify-center gap-3 rounded-md border-2 border-slate-100 bg-white px-10 text-sm tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <TableSVG className="mt-0.5 h-5 w-5 fill-slate-950" />{" "}
            <p>My Projects</p>
          </Link>

          <button
            onClick={() => {
              signOut();
              router.push("/").catch((e: any) => console.error(e));
            }}
            className="flex h-[50px] flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 text-sm tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <ExternalSVG className="fill-slate-950" /> <p>Signout</p>
          </button>

          <Image
            src={session?.user.image ?? "/images/default_pfp.png"}
            width={50}
            height={50}
            alt=""
            className="h-10 w-10 rounded-full"
          />
        </div>
      )}
    </nav>
  );
}
