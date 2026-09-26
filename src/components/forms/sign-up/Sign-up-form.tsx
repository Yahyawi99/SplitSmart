"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
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

import AuthOptionsSelector from "./AuthOptionsSelector";

export default function SignUpForm() {
  const [selectedAuthOption, setSelectedAuthOption] = useState<
    "Email" | "Google" | "Github"
  >("Email");

  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateForm = () => {
    if (selectedAuthOption === "Email") {
      if (password !== confirmPassword) {
        return "Passwords do not match.";
      }
      if (
        !yourName ||
        !yourEmail ||
        !password
      ) {
        return "Please fill in all required fields.";
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await authClient.signUp.email(
        {
          name: yourName,
          email: yourEmail,
          password,
        },
        {
          onError(ctx) {
            setError(ctx.error.message);
          },
        }
      );

      try {
        const { error: otpError } =
          await authClient.emailOtp.sendVerificationOtp({
            email: yourEmail,
            type: "email-verification",
          });

        if (otpError) {
          setError(
            `Account created but failed to send verification email: ${otpError.message}`
          );
        }
      } catch (otpErr: any) {
        console.warn("Failed to send OTP:", otpErr);
      }

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(yourEmail)}`
      );
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] gap-0 rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-0 text-(--text-primary) ring-0">
      <CardHeader className="border-b border-(--text-dim)/25 p-5 pb-4 text-left">
        <CardTitle className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight text-(--text-primary)">
          Create your account
        </CardTitle>
        <CardDescription className="mt-0.5 text-sm text-(--text-secondary)">
          Sign up to start managing and splitting shared expenses.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-5 p-5">
          <AuthOptionsSelector
            selectedOption={selectedAuthOption}
            onSelectOption={setSelectedAuthOption}
          />

          {selectedAuthOption === "Email" && (
            <div className="grid gap-4">
              <h3 className="text-base font-semibold text-(--text-primary)">
                Your information
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="your-name" className="text-sm font-medium text-(--text-secondary)">
                  Full name
                </Label>
                <Input
                  id="your-name"
                  placeholder="Jane Doe"
                  required
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-btn) focus:ring-(--accent-btn)/30"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="your-email" className="text-sm font-medium text-(--text-secondary)">
                  Email address
                </Label>
                <Input
                  id="your-email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  value={yourEmail}
                  onChange={(e) => setYourEmail(e.target.value)}
                  className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-btn) focus:ring-(--accent-btn)/30"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-(--text-secondary)">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-btn) focus:ring-(--accent-btn)/30"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-(--text-secondary)">
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 rounded-lg border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-btn) focus:ring-(--accent-btn)/30"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-(--accent-red-hover)">{error}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-(--text-dim)/25 p-5 text-sm text-(--text-secondary)">
          {selectedAuthOption === "Email" ? (
            <Button
              className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          ) : (
            <p className="text-center text-sm text-(--text-secondary)">
              Continue sign-up with {selectedAuthOption}.
            </p>
          )}

          <div className="text-center text-sm text-(--text-secondary)">
            Already have an account?{" "}
            <a
              href="sign-in"
              className="font-semibold text-(--accent-btn-hover) transition-colors hover:text-(--text-primary) hover:underline"
            >
              Sign in
            </a>
          </div>

          <div className="mt-1 text-center text-sm text-(--text-muted)">
            <a
              href="/"
              className="flex items-center justify-center gap-1 transition-colors hover:text-(--text-primary) hover:underline"
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
              <span>Back to home</span>
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
