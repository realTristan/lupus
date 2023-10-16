import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/Loading";
import TableModel from "~/components/TableModel";
import Head from "next/head";
import {
  TEST_PROJECT_TABLE_DATA,
  TEST_PROJECT_TABLE_HEADERS,
} from "~/lib/constants";
import Navbar from "~/components/Navbar";

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

          <Navbar />

          <main className="mt-24 flex min-h-screen flex-col items-start gap-10 p-14">
            <div>
              <h1 className="text-6xl font-black">{data.result.name}</h1>
              <p className="mt-2 text-2xl">{data.result.description}</p>
            </div>
            <div>
              <h1 className="w-fit text-5xl font-thin" contentEditable={true}>
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
