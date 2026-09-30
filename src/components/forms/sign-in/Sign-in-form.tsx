"use client";

import * as React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp, signIn } from "@/lib/auth-client";
import { wait } from "@/utils/wait";
import { Link } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const t = useTranslations("auth.signInPage");

  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    if (!email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    try {
      await signIn.email(
        {
          email,
          password,
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message as string);
            return;
          },
          onSuccess: async (ctx) => {
            // Send verification OTP if the email is not verified
            if (ctx.data?.user && !ctx.data.user.emailVerified) {
              setSuccessMessage(
                "Sign in successful! Redirecting to email verification...",
              );
              try {
                await emailOtp.sendVerificationOtp({
                  email: email,
                  type: "email-verification",
                });
              } catch (otpError) {
                console.warn("Failed to send OTP:", otpError);
              } finally {
                router.push(
                  `/auth/verify-email?email=${encodeURIComponent(email)}`,
                );
                return;
              }
            }

            setSuccessMessage("Sign in successful! Redirecting...");
            await wait(2500);
            router.push("/groups");
          },
        },
      );
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-105 gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
      <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
        <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
          {t("header")}
        </CardTitle>
        <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
          {t("subHeader")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-(--text-secondary)"
            >
              {t("form.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("form.email.placeholder")}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--text-dim) focus:ring-0 focus-visible:ring-0"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-(--text-secondary)"
            >
              {t("form.password.label")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t("form.password.placeholder")}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--text-dim) focus:ring-0 focus-visible:ring-0"
            />
          </div>

          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-(--accent-green)/30 bg-(--accent-green)/10 p-3 text-center text-sm font-medium text-(--accent-green)"
            >
              {successMessage}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-(--accent-red)/30 bg-(--accent-red)/10 p-3 text-center text-sm font-medium text-(--accent-red-hover)"
            >
              {error}
            </p>
          )}

          <Button
            className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)/75"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? t("actions.submitting") : t("actions.submit")}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-(--text-dim)/25 p-5 text-sm text-(--text-secondary)">
        <div className="text-center">
          {t("actions.registerPrompt")}{" "}
          <a
            href="/auth/sign-up"
            className="font-semibold text-(--accent-btn-hover) transition-opacity hover:opacity-75 hover:underline"
          >
            {t("actions.registerLink")}
          </a>
        </div>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-(--accent-btn-hover) transition-opacity hover:opacity-75 hover:underline"
          >
            {t("actions.forgotPassword")}
          </Link>
        </div>

        {/* Go back to landing page */}
        <div className="mt-1 text-center text-sm text-(--text-muted)">
          <a
            href="/"
            className="flex items-center justify-center space-x-1 transition-colors hover:text-(--text-primary) hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span> {t("actions.backToHome")}</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
