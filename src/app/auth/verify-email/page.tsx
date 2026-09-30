import VerifyEmailForm from "@/components/forms/verify-email/Verify-email-form";
import { Logo } from "@/components/shared";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8">
      <Logo open={true} />
      <VerifyEmailForm />
    </div>
  );
}
