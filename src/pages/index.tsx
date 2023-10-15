import Head from "next/head";
import Link from "next/link";
import CircleBackground from "~/components/CircleBackground";
import Navbar from "~/components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Arc</title>
        <meta name="description" content="Arc AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <CircleBackground />

      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mx-10 text-center text-8xl font-bold md:text-9xl xl:w-3/4">
          Welcome<mark className="bg-transparent text-slate-300">,</mark> to the
          future
          <mark className="bg-transparent text-slate-300">.</mark>
        </h1>
        <div className="m-10 flex flex-row gap-10">
          <Link
            href="/login?redirect=/projects"
            className="rounded-full bg-slate-950 px-14 py-5 text-xl font-extrabold tracking-wider text-white shadow-xl duration-500 ease-in-out hover:bg-white hover:text-slate-950"
          >
            Get started
          </Link>
          <button className="rounded-full bg-slate-950 px-14 py-5 text-xl font-extrabold tracking-wider text-white shadow-xl duration-500 ease-in-out hover:bg-white hover:text-slate-950">
            Learn more
          </button>
        </div>
      </main>
    </>
  );
}
