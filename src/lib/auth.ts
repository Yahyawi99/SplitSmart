import { betterAuth } from "better-auth";
import {
  emailOTP,
} from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@database/generated/prisma/client";



// const prisma = new PrismaClient();

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

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
