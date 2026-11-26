import { betterAuth } from "better-auth";
import { emailOTP, anonymous } from "better-auth/plugins";
import { authDatabaseAdapter } from "@/database/auth-adapter";
import { emailService } from "@/lib/email";
import { userRepository } from "@/repositories/user-repository";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL! as string,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await emailService.resetPassword(user.email, url);
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID! as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const user = await userRepository.findNameByEmail(email);
        const userName = user?.name ?? "";

        if (type === "email-verification") {
          await emailService.sendOTP(email, userName, otp);
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10,
    }),
    anonymous(),
  ],

  database: authDatabaseAdapter,
});
