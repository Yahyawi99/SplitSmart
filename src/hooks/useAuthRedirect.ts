// hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function useAuthRedirect(
  session: ReturnType<typeof useSession>["data"],
  route?: string,
) {
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push(route ? route : "/auth/sign-in");
      return;
    }

    router.push("/groups");
  }, [session, router]);
}
