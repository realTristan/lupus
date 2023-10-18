import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import PlusSVG from "../SvgComponents/Plus";
import ExternalSVG from "../SvgComponents/External";
import TableSVG from "../SvgComponents/Table";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import NavbarButton from "./NavbarButton";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 z-50 flex w-screen flex-row justify-between border-b-2 border-slate-200 bg-white px-7 py-4">
      <Link
        href="/"
        className="group flex flex-row items-center justify-center gap-2 rounded-md border-2 border-transparent p-3 hover:border-slate-100 hover:bg-slate-50"
      >
        <Image
          src="/images/lupusai.png"
          width={50}
          height={50}
          alt=""
          className="h-14 w-14 rounded-full"
        />

        <h1 className="text-3xl font-black">Lupus</h1>
        <div className="ml-1 mt-1 rounded-md border-2 border-pink-400 bg-pink-400/30 px-2 py-0.5 text-sm font-thin text-slate-950">
          beta v0.1
        </div>
      </Link>

      {status !== "authenticated" && <SignInWithGoogleButton />}

      {status === "authenticated" && (
        <div className="flex flex-row items-center justify-center gap-4">
          <NavbarButton href="/projects/new">
            <PlusSVG className="fill-slate-950" /> <p>New Project</p>
          </NavbarButton>

          <NavbarButton href="/projects">
            <TableSVG className="mt-0.5 h-5 w-5 fill-slate-950" />{" "}
            <p>My Projects</p>
          </NavbarButton>

          <NavbarButton href="/learn-more" onClick={() => signOut()}>
            <ExternalSVG className="fill-slate-950" /> <p>Sign out</p>
          </NavbarButton>

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
