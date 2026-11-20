import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/database/prisma";
import { GroupRepository } from "@/repositories/group-repository";

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
