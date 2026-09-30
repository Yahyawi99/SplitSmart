import ResetPasswordForm from "@/components/forms/reset-password/Reset-password-form";
import { Logo } from "@/components/shared";

export default function ResetPasswordPage() {
  return (
    <div className="light flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8">
      <Logo open={true} />
      <ResetPasswordForm />
    </div>
  );
}
