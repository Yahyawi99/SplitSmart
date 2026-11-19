import type { Prisma, PrismaClient } from "@/generated/prisma/client";

type TransactionWork<T> = (transaction: Prisma.TransactionClient) => Promise<T>;

function isSerializationConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2034"
  );
}

export async function withSerializableTransaction<T>(
  work: TransactionWork<T>,
  client?: PrismaClient,
): Promise<T> {
  const database = client ?? (await import("@/lib/prisma")).default;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await database.$transaction(work, {
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000,
      });
    } catch (error) {
      if (!isSerializationConflict(error) || attempt >= 2) {
        throw error;
      }
    }
  }
}
