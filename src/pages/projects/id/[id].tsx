import { useRouter, type NextRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingCenter from "~/components/Loading";

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

    refetch();

    if (data?.result) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-black">{data.result.name}</h1>
          <p className="text-2xl">{data.result.description}</p>
        </div>
      );
    }
  }

  return <LoadingCenter />;
}
