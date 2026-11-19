CREATE TYPE "GroupRole" AS ENUM ('OWNER', 'MEMBER');
CREATE TYPE "SplitType" AS ENUM ('EQUAL', 'EXACT', 'PERCENTAGE', 'SHARES');

CREATE TABLE "group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "currency" VARCHAR(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "group_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "group_currency_format_check" CHECK ("currency" ~ '^[A-Z]{3}$')
);

CREATE TABLE "group_member" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "group_member_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "expense" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "exchangeRate" DECIMAL(20,10) NOT NULL,
    "category" TEXT NOT NULL,
    "splitType" "SplitType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "expense_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "expense_amount_positive_check" CHECK ("amountCents" > 0),
    CONSTRAINT "expense_currency_format_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
    CONSTRAINT "expense_exchange_rate_positive_check" CHECK ("exchangeRate" > 0)
);

CREATE TABLE "expense_split" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "owedCents" INTEGER NOT NULL,
    CONSTRAINT "expense_split_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "expense_split_owed_nonnegative_check" CHECK ("owedCents" >= 0)
);

CREATE TABLE "settlement" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    CONSTRAINT "settlement_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "settlement_amount_positive_check" CHECK ("amountCents" > 0),
    CONSTRAINT "settlement_distinct_participants_check" CHECK ("fromUserId" <> "toUserId")
);

CREATE TABLE "receipt" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "parsedData" JSONB,
    "confidence" DECIMAL(5,4),
    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "receipt_confidence_range_check" CHECK ("confidence" IS NULL OR ("confidence" >= 0 AND "confidence" <= 1))
);

CREATE UNIQUE INDEX "group_member_groupId_userId_key" ON "group_member"("groupId", "userId");
CREATE INDEX "group_member_userId_idx" ON "group_member"("userId");
CREATE INDEX "group_createdById_idx" ON "group"("createdById");
CREATE INDEX "expense_groupId_idx" ON "expense"("groupId");
CREATE INDEX "expense_payerId_idx" ON "expense"("payerId");
CREATE UNIQUE INDEX "expense_split_expenseId_userId_key" ON "expense_split"("expenseId", "userId");
CREATE INDEX "expense_split_userId_idx" ON "expense_split"("userId");
CREATE INDEX "settlement_groupId_idx" ON "settlement"("groupId");
CREATE INDEX "settlement_fromUserId_idx" ON "settlement"("fromUserId");
CREATE INDEX "settlement_toUserId_idx" ON "settlement"("toUserId");
CREATE UNIQUE INDEX "receipt_expenseId_key" ON "receipt"("expenseId");

ALTER TABLE "group"
    ADD CONSTRAINT "group_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "group_member"
    ADD CONSTRAINT "group_member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "group_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "expense"
    ADD CONSTRAINT "expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "expense_split"
    ADD CONSTRAINT "expense_split_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "expense_split_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "settlement"
    ADD CONSTRAINT "settlement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "settlement_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "settlement_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "receipt"
    ADD CONSTRAINT "receipt_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;