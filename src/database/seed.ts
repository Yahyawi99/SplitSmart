import seedData from "../../public/data/seed.json";

import { Client } from "pg";

type Row = Record<string, unknown> & { id: string };

const TABLES = [
  "user",
  "group",
  "group_member",
  "expense",
  "expense_split",
  "settlement",
  "receipt",
] as const;
type Table = (typeof TABLES)[number];

const CLEAR_TABLES = [
  // Business tables only. Never truncate Better Auth tables such as
  // session, account, or verification.
  "receipt",
  "expense_split",
  "settlement",
  "expense",
  "group_member",
  "group",
] as const;

type SeedData = Record<Table, Row[]>;

const data: SeedData = seedData;

const quoteIdentifier = (name: string) => `"${name.replace(/"/g, '""')}"`;

export async function seedDatabase(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query("BEGIN");

    const clearList = CLEAR_TABLES.map(
      (table) => `public.${quoteIdentifier(table)}`,
    ).join(", ");
    await client.query(`TRUNCATE TABLE ${clearList} RESTART IDENTITY CASCADE`);

    for (const table of TABLES) {
      const rows = data[table] ?? [];
      for (const row of rows) {
        if (table === "user") {
          const existingUser = await client.query(
            `SELECT 1 FROM public.${quoteIdentifier("user")} WHERE id = $1 OR email = $2 LIMIT 1`,
            [row.id, row.email],
          );
          if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
            continue;
          }
        }

        const valuesByColumn: Record<string, unknown> = { ...row };
        if (table === "user") {
          valuesByColumn.updatedAt ??= new Date();
        }

        const columns = Object.keys(valuesByColumn);
        const values = columns.map((column) => {
          const value = valuesByColumn[column];
          return value !== null &&
            typeof value === "object" &&
            !(value instanceof Date)
            ? JSON.stringify(value)
            : value;
        });
        const columnList = columns.map(quoteIdentifier).join(", ");
        const parameterList = columns
          .map((_, index) => `$${index + 1}`)
          .join(", ");

        await client.query(
          `INSERT INTO public.${quoteIdentifier(table)} (${columnList}) VALUES (${parameterList})`,
          values,
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}
