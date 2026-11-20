import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createSettlement } from "@/features/settlements/create-settlement";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const date = new Date(body.date);
    const amountCents = Math.round(amount * 100);

    if (
      typeof body.groupId !== "string" ||
      typeof body.fromUserId !== "string" ||
      typeof body.toUserId !== "string" ||
      body.fromUserId === body.toUserId ||
      !Number.isFinite(amount) ||
      !Number.isSafeInteger(amountCents) ||
      amountCents <= 0 ||
      Number.isNaN(date.getTime()) ||
      (body.note !== undefined && typeof body.note !== "string")
    ) {
      return Response.json(
        { error: "Invalid settlement details" },
        { status: 400 },
      );
    }

    const settlement = await createSettlement({
      groupId: body.groupId,
      actorUserId: session.user.id,
      fromUserId: body.fromUserId,
      toUserId: body.toUserId,
      amountCents,
      date,
      note: body.note,
    });

    return Response.json(settlement, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record settlement";
    return Response.json({ error: message }, { status: 400 });
  }
}
