import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  baseURL: "http://localhost:3000/",

  emailAndPassword: { enabled: true },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
          const user = await prisma.user.findUnique({ where: { email } });
          const userName = user?.name || "";

          if ((type = "email-verification")) {
            await emailService.sendOTP(email, userName, otp);
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
