import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/database/prisma";
import { GroupRepository } from "@/repositories/group-repository";
import { withSerializableTransaction } from "@/database/transaction";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Number(new URL(request.url).searchParams.get("page") ?? "1");
  if (!Number.isSafeInteger(page) || page < 1) {
    return Response.json({ error: "Invalid page" }, { status: 400 });
  }

  try {
    const result = await new GroupRepository(prisma.group).findForUser(
      session.user.id,
      page,
    );
    return Response.json(result);
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, currency } = body;

    if (!name || typeof name !== "string") {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await withSerializableTransaction(async (tx) => {
      const repo = new GroupRepository(tx.group);
      return repo.createWithOwner({
        creatorId: session.user.id,
        name,
        description: description ?? null,
        currency: currency || "USD",
      });
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to create group:", error);
    return Response.json({ error: "Failed to create group" }, { status: 500 });
  }
}
