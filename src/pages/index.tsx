import Head from "next/head";
import Link from "next/link";
import CirclesBackground from "~/components/SvgComponents/CirclesBackground";
import Navbar from "~/components/Navbar/Navbar";
import ExternalSVG from "~/components/SvgComponents/External";

export default function Home() {
  return (
    <>
      <Head>
        <title>Lupus AI</title>
        <meta name="description" content="Lupus AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <CirclesBackground className="-z-10 opacity-10" />

      <main className="flex min-h-screen flex-col items-center justify-center pt-40">
        <h1 className="mx-10 text-center text-7xl font-bold md:text-8xl xl:w-3/4">
          Build<mark className="bg-transparent text-blue-500">.</mark>{" "}
          Collaborate<mark className="bg-transparent text-pink-500">.</mark>{" "}
          Explore<mark className="bg-transparent text-blue-500">.</mark>
        </h1>
        <div className="m-10 flex flex-row gap-10">
          <Link
            href="/projects"
            className="flex flex-row items-center justify-center gap-2 rounded-md bg-blue-500 px-10 py-4 text-sm font-normal tracking-wider text-white hover:bg-blue-500/80"
          >
            <ExternalSVG className="fill-white" /> <p>Get started</p>
          </Link>
          <Link
            href="/learn-more"
            className="flex flex-row items-center justify-center gap-2 rounded-md border-2 border-slate-100 bg-white px-10 py-4 text-sm font-normal tracking-wider text-slate-950 hover:bg-slate-50"
          >
            <ExternalSVG className="fill-slate-950" /> <p>Learn more</p>
          </Link>
        </div>
      </main>
    </>
  );
}
