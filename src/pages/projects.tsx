import Head from "next/head";

import { useSession } from "next-auth/react";
import { type NextRouter, useRouter } from "next/router";
import LoadingCenter from "~/components/Loading";
import { useEffect } from "react";

/**
 * Projects page
 * @returns {JSX.Element} JSX.Element
 */
export default function Projects(): JSX.Element {
  // Check if the user is logged in
  const { data: session, status } = useSession();

  // Next router for redirecting to the login endpoint if the
  // user isn't logged in.
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/projects").catch((e) => console.log(e));
    }
  }, [router, status]);

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Projects | arcai</title>
        </Head>
        <p>Signed in as {session.user.email}</p>;
      </>
    );
  }

  return <LoadingCenter />;
}
