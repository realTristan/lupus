import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/Loading";
import TableModel from "~/components/TableModel";
import Link from "next/link";
import PlusSVG from "~/components/svgs/Plus";
import Image from "next/image";
import Head from "next/head";
import {
  TEST_PROJECT_TABLE_DATA,
  TEST_PROJECT_TABLE_HEADERS,
} from "~/lib/constants";

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
              src="/images/arcbuildinglogo2.png"
              width={50}
              height={100}
              alt=""
              className="w-auto rounded-full"
            />
            <h1 className="text-3xl font-bold">arcai</h1>
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

          <main className="mt-24 flex min-h-screen flex-col items-start gap-10 p-14">
            <div>
              <h1 className="text-4xl font-black">{data.result.name}</h1>
              <p className="text-2xl">{data.result.description}</p>
            </div>
            <div>
              <h1 className="w-fit text-6xl font-black" contentEditable={true}>
                Table 1
              </h1>
              <TableModel
                className="m-7"
                headers={TEST_PROJECT_TABLE_HEADERS}
                data={TEST_PROJECT_TABLE_DATA}
              />
            </div>
          </main>
        </>
      );
    }
  }

  return <LoadingCenter />;
}
