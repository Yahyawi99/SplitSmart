// import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/database/prisma";

export class UserRepository {
  constructor(private readonly users: Prisma.TransactionClient["user"]) {}

  findById(id: string) {
    return this.users.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findNameByEmail(email: string) {
    return this.users.findUnique({
      where: { email },
      select: { name: true },
    });
  }
}

export const userRepository = new UserRepository(prisma.user);
