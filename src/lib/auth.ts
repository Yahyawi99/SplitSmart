import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailService } from "@/lib/email";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",

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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // const user = await prisma.findUnique({ where: { email } });
        // const userName = user?.name || "";

        if ((type = "email-verification")) {
          await emailService.sendOTP(email, "", otp);
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10,
    }),
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
