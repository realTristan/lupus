import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import GoogleLogoSmallSVG from "./svgs/Google";
import PlusSVG from "./svgs/Plus";
import ExternalSVG from "./svgs/External";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 flex w-screen flex-row justify-between p-10">
      <Link href="/" className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold">
          <mark className="mr-1 bg-transparent text-6xl font-black">A</mark>rc
          AI{" "}
          <mark className="bg-transparent text-base font-thin">beta v0.1</mark>
        </h1>
        <span className="h-1 w-20 bg-slate-300"></span>
      </Link>

      {status !== "authenticated" && (
        <Link
          href="/login?redirect=/projects"
          className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
        >
          <GoogleLogoSmallSVG className="fill-slate-950" />{" "}
          <p>Sign in with Google</p>
        </Link>
      )}

      {status === "authenticated" && (
        <div className="flex flex-row gap-4">
          <Link
            href="/projects/new"
            className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <PlusSVG className="fill-slate-950" /> <p>New Project</p>
          </Link>

          <button
            onClick={() => {
              signOut();
              router.push("/").catch((e: any) => console.log(e.message));
            }}
            className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-14 py-3 text-lg font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <ExternalSVG className="fill-slate-950" /> <p>Signout</p>
          </button>

          <Image
            src={session?.user.image ?? ""}
            width={65}
            height={65}
            alt=""
            className="h-16 w-16 rounded-full"
          />
        </div>
      )}
    </nav>
  );
}
