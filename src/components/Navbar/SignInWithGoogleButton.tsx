import Link from "next/link";
import GoogleLogoSmallSVG from "../SvgComponents/Google";

export default function SignInWithGoogleButton(): JSX.Element {
  return (
    <Link
      href="/login?redirect=/projects"
      className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-7 py-2 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
    >
      <GoogleLogoSmallSVG className="fill-slate-950" />{" "}
      <p>Sign in with Google</p>
    </Link>
  );
}
