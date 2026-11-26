import { createAuthClient } from "better-auth/react";
import { emailOTPClient, anonymousClient } from "better-auth/client/plugins";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  emailOtp,
  requestPasswordReset,
  resetPassword,
} = createAuthClient({
  plugins: [emailOTPClient(), anonymousClient()],
});
