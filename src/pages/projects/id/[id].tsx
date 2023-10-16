import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/Loading";
import { base64encode } from "~/lib/crypto";
import TrainDataTable from "~/components/TrainDataTable";
import Link from "next/link";
import PlusSVG from "~/components/svgs/Plus";
import Image from "next/image";
import Head from "next/head";

export default function ProjectPage() {
  const { data: session, status } = useSession();

  const router: NextRouter = useRouter();

  const { data, refetch } = api.projects.getProject.useQuery(
    {
      secret: session?.user.secret ?? "",
      id: router.query.id as string,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  if (status === "unauthenticated") {
    router.push("/login?redirect=/projects").catch((e) => console.log(e));
    return <LoadingCenter />;
  }

  if (status === "authenticated") {
    if (!session?.user.secret) {
      return <></>;
    }

    // If not already fetched data
    if (!data) {
      refetch();
    }

    const tableHeaders = ["ID", "Gender (M/F)", "Height (cm)"];
    const tableData = [
      { id: base64encode(Math.random().toString()), gender: 0, height: 220 },
      { id: base64encode(Math.random().toString()), gender: 0, height: 210 },
      { id: base64encode(Math.random().toString()), gender: 1, height: 120 },
    ];

    if (data?.result) {
      return (
        <>
          <Head>
            <title>{data.result.name} | arcai</title>
          </Head>

          <Link
            href="/"
            className="fixed left-10 top-10 flex flex-row items-center justify-center gap-4"
          >
            <Image
              src="/images/arcai_logo.png"
              width={50}
              height={100}
              alt=""
              className="w-auto rounded-full"
            />
            <h1 className="mb-2 text-3xl font-bold">arcai</h1>
          </Link>

          <div className="fixed right-10 top-10 flex flex-row items-center justify-center gap-6">
            <Link
              href="/projects/new"
              className="m-4 flex flex-row gap-2 rounded-full bg-slate-950 px-10 py-4 text-white shadow-xl hover:bg-slate-800"
            >
              <PlusSVG />
              <p>New Project</p>
            </Link>
            <Image
              src={session?.user.image ?? ""}
              width={65}
              height={65}
              alt=""
              className="rounded-full"
            />
          </div>

          <main className="mt-24 flex min-h-screen flex-col items-center p-14">
            <h1 className="text-4xl font-black">{data.result.name}</h1>
            <p className="text-2xl">{data.result.description}</p>

            <TrainDataTable headers={tableHeaders} data={tableData} />
          </main>
        </>
      );
    }
  }

  return <LoadingCenter />;
}
