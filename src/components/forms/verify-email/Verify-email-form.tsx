"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { emailOtp, useSession } from "@/lib/auth-client";
import { wait } from "@/utils/wait";

const RESEND_COOLDOWN_SECONDS = 180;

export default function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const cooldownTime = `${Math.floor(resendCooldown / 60)}:${String(
    resendCooldown % 60,
  ).padStart(2, "0")}`;

  

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timeoutId = window.setTimeout(() => {
      setResendCooldown((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [resendCooldown]);

  const handleVerification = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setIsLoading(false);
      return;
    }
    try {
      const { error: otpError } = await emailOtp.verifyEmail({
        email: email,
        otp: otp,
      });

      if (otpError) {
        setSuccessMessage(null);
        setError(
          otpError.message ||
            "An unexpected error occurred during verification.",
        );
        return;
      }

      setSuccessMessage("Email verification successful! Redirecting...");
      await wait(2500);
      router.push("/groups");
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during verification.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email address is required to resend code.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage("Resending code...");

      const { error: otpError } = await emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (otpError) {
        setSuccessMessage(null);
        setError(
          otpError.message ||
            "An unexpected error occurred during verification.",
        );
        return;
      }

      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setSuccessMessage("New verification code sent! Please check your email.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setSuccessMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-105 gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
      <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
        <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
          Verify Your Email
        </CardTitle>
        <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
          A 6-digit verification code has been sent to your email address.
          {email && (
            <span className="mt-2 block font-medium text-(--text-primary)">
              {email}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleVerification} className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="otp-code"
              className="text-center text-sm font-medium text-(--text-secondary)"
            >
              Verification Code
            </Label>
            <Input
              id="otp-code"
              type="text"
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]{6}"
              placeholder="000000"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-center text-xl tracking-[1rem] text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--text-dim) focus:ring-0 focus-visible:ring-0"
            />
          </div>
          {error && (
            <p className="text-center text-sm text-(--accent-red-hover)">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-center text-sm text-(--accent-btn-hover)">
              {successMessage}
            </p>
          )}
          <Button
            className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)/75"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-(--text-dim)/25 p-5">
        <div className="text-center text-sm text-(--text-secondary)">
          Didn't receive the code?{" "}
          <Button
            variant="link"
            className="h-auto p-0 font-semibold text-(--accent-btn-hover) transition-opacity hover:opacity-75 hover:underline"
            onClick={handleResendCode}
            disabled={isLoading || !email || resendCooldown > 0}
          >
            Resend Code
          </Button>
          {resendCooldown > 0 && (
            <p className="mt-1 text-xs text-(--text-muted)">
              You can request another code in {cooldownTime}.
            </p>
          )}
        </div>
        <div className="mt-1 text-center text-sm text-(--text-muted)">
          <Button
            variant="link"
            className="flex h-auto items-center justify-center space-x-1 p-0 hover:text-(--text-primary) hover:underline"
            onClick={() => router.push("/auth/sign-in")}
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
            <span>Back to login</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
