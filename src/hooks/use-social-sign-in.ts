"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

type SocialProvider = "Google" | "Github";

export function useSocialSignIn(onStart?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setIsLoading(true);
    setError(null);
    onStart?.();

    try {
      const { error: socialSignInError } = await signIn.social({
        provider: provider === "Google" ? "google" : "github",
        callbackURL: "/groups",
      });

      if (socialSignInError) {
        setError(socialSignInError.message || "Social authentication failed.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Social authentication failed.",
      );
      setIsLoading(false);
    }
  };

  return { handleSocialSignIn, isLoading, error };
}