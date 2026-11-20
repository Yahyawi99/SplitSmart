import { headers } from "next/headers";
import { SplitType } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { createExpense } from "@/features/expenses/create-expense";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const participants = body.participants;
    const date = new Date(body.date);

    if (
      typeof body.groupId !== "string" ||
      typeof body.payerId !== "string" ||
      typeof body.description !== "string" ||
      typeof body.category !== "string" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Array.isArray(participants) ||
      participants.length === 0 ||
      Number.isNaN(date.getTime()) ||
      participants.some((userId: unknown) => typeof userId !== "string")
    ) {
      return Response.json(
        { error: "Invalid expense details" },
        { status: 400 },
      );
    }

    const amountCents = Math.round(amount * 100);
    if (
      !Number.isSafeInteger(amountCents) ||
      amountCents <= 0 ||
      amountCents > 2_147_483_647
    ) {
      return Response.json(
        { error: "Invalid expense amount" },
        { status: 400 },
      );
    }

    const expense = await createExpense({
      groupId: body.groupId,
      actorUserId: session.user.id,
      payerId: body.payerId,
      description: body.description,
      amountCents,
      currency: body.currency,
      exchangeRate: "1",
      category: body.category,
      splitType: SplitType.EQUAL,
      participants: participants.map((userId: string) => ({ userId })),
      date,
    });

    return Response.json(expense, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create expense";
    return Response.json({ error: message }, { status: 400 });
  }
}
