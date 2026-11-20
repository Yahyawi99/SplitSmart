import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/database/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
    select: { active: true },
  });
  if (!membership?.active) {
    return Response.json({ error: "Group not found" }, { status: 404 });
  }

  const members = await prisma.groupMember.findMany({
    where: { groupId, active: true },
    select: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  return Response.json({ members: members.map(({ user }) => user) });
}
