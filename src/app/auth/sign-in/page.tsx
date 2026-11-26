"use client";

import { useEffect, useState } from "react";
import SignInForm from "@/components/forms/sign-in/Sign-in-form";
import { Logo } from "@/components/shared";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [theme, setTheme] = useState("light");
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/groups");
      return;
    }
  }, [session, router]);


  return (
    <div
      className={`${theme} flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8`}
    >
      <Logo open={true} />

      <SignInForm />
    </div>
  );
}
