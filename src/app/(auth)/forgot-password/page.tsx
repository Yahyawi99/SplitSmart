"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { Logo } from "@/components/shared";

// import { authClient } from "@/lib/auth-client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    // setIsSubmitting(true);
    // setMessage(null);
    // setIsSuccess(false);
    // try {
    //   await authClient.requestPasswordReset(
    //     {
    //       email,
    //       redirectTo: "/auth/reset-password",
    //     },
    //     {
    //       onError: (ctx) => {
    //         setIsSuccess(false);
    //         setMessage(ctx.error.message as string);
    //       },
    //       onSuccess: () => {
    //         setIsSuccess(true);
    //         setMessage("Reset link was sent successfully!");
    //       },
    //     }
    //   );
    // } catch (error) {
    //   setMessage("An unexpected error occurred. Please try again.");
    //   setIsSuccess(false);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="flex min-h-lvh flex-col items-center justify-center gap-6 bg-(--bg-base) px-4 py-8">
      <Logo open={true} />

      <Card className="w-full max-w-105 gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
        <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
          <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
            Forgot Password
          </CardTitle>
          <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-(--text-secondary)"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-btn) focus:ring-(--accent-btn)/30"
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-4 text-center text-sm font-medium ${
                  isSuccess
                    ? "border border-(--accent-green)/30 bg-(--accent-green)/10 text-(--accent-green)"
                    : "border border-(--accent-red)/30 bg-(--accent-red)/10 text-(--accent-red-hover)"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)/75"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-t border-(--text-dim)/25 p-5">
          <a
            href="/en/auth/sign-in"
            className="w-full text-center text-sm text-(--text-muted) transition-colors hover:text-(--text-primary) hover:underline"
          >
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
