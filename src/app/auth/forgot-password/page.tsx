"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/components/forms/forgot-password/Forgot-password-form";
import { Logo } from "@/components/shared";
import { useSession } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/groups");
    }
  }, [session, router]);

  return (
    <div className="light flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8">
      <Logo open={true} />
      <ForgotPasswordForm />
    </div>
  );
}
