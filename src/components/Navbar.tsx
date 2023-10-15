import Image from "next/image";
import Link from "next/link";
import GoogleLogoSmallSVG from "~/components/svgs/Google";

export default function Navbar() {
  return (
    <nav className="fixed left-10 top-10 flex items-center justify-between">
      <div className="flex flex-row items-center justify-center gap-4">
        <Image
          src="/images/arclogo.png"
          width={50}
          height={100}
          alt=""
          className="w-auto rounded-full"
        />
        <h1 className="mb-2 text-3xl font-bold">arcai</h1>
      </div>

      <Link
        href="/login?redirect=/projects"
        className="group fixed right-10 top-10 flex flex-row gap-2 rounded-full bg-slate-950 px-10 py-5 shadow-xl hover:bg-white"
      >
        <GoogleLogoSmallSVG />
        <p className="font-bold tracking-wide text-white group-hover:text-slate-950">
          Sign in with Google
        </p>
      </Link>
    </nav>
  );
}
