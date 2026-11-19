import "server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const authDatabaseAdapter = prismaAdapter(prisma, {
  provider: "postgresql",
});