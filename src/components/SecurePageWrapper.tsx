import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function SecurePageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();

  switch (session.status) {
    case "authenticated":
      return <>{children}</>;
    case "unauthenticated":
      router.push("/");
      break;
    case "loading":
      return <h1>Loading</h1>;
  }

  return null;
}
