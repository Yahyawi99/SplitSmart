import { readFileSync } from "node:fs";
import path from "node:path";
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

type SeedData = Record<Table, Row[]>;

const data: SeedData = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts", "seed-data.json"), "utf8"),
);

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

    for (const table of [...TABLES].reverse()) {
      const ids = (data[table] ?? []).map(({ id }) => id);
      if (ids.length === 0) continue;

      await client.query(
        `DELETE FROM public.${quoteIdentifier(table)} WHERE id = ANY($1::text[])`,
        [ids],
      );
    }

    for (const table of TABLES) {
      const rows = data[table] ?? [];
      for (const row of rows) {
        const valuesByColumn: Record<string, unknown> = { ...row };
        if (table === "user") {
          valuesByColumn.updatedAt ??= new Date();
        }

        const columns = Object.keys(valuesByColumn);
        const values = columns.map((column) => {
          const value = valuesByColumn[column];
          return value !== null && typeof value === "object" && !(value instanceof Date)
            ? JSON.stringify(value)
            : value;
        });
        const columnList = columns.map(quoteIdentifier).join(", ");
        const parameterList = columns.map((_, index) => `$${index + 1}`).join(", ");

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