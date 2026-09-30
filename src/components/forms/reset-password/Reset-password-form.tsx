"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { resetPassword } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSuccess(false);

    if (!token) {
      setMessage("Invalid token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(
        {
          newPassword,
          token,
        },
        {
          onError: (ctx) => {
            setIsSuccess(false);
            setMessage(ctx.error.message);
          },
          onSuccess: () => {
            setIsSuccess(true);
            setMessage("Password updated successfully!");
            setNewPassword("");
            setConfirmPassword("");
            router.push("/auth/sign-in");
          },
        },
      );
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-105 gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
        <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
          <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
            Reset Link Unavailable
          </CardTitle>
          <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
            This password reset link is missing its token. Request a new link to
            continue.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-t border-(--text-dim)/25 p-5">
          <a
            href="/auth/forgot-password"
            className="w-full text-center text-sm text-(--accent-btn-hover) transition-opacity hover:opacity-75 hover:underline"
          >
            Request a new reset link
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-105 gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
      <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
        <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
          Reset Password
        </CardTitle>
        <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
          Enter your new password below.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-(--text-secondary)"
            >
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--text-dim) focus:ring-0 focus-visible:ring-0"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-(--text-secondary)"
            >
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--text-dim) focus:ring-0 focus-visible:ring-0"
            />
          </div>

          {message && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`rounded-lg border p-3 text-center text-sm font-medium ${
                isSuccess
                  ? "border-(--accent-green)/30 bg-(--accent-green)/10 text-(--accent-green)"
                  : "border-(--accent-red)/30 bg-(--accent-red)/10 text-(--accent-red-hover)"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)/75"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-(--text-dim)/25 p-5">
        <a
          href="/auth/sign-in"
          className="w-full text-center text-sm text-(--text-muted) transition-colors hover:text-(--text-primary) hover:underline"
        >
          Back to sign in
        </a>
      </CardFooter>
    </Card>
  );
}
