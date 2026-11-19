import { seedDatabase } from "@/database/seed";

seedDatabase().catch((error: unknown) => {
  console.error(
    "\nSeed failed, rolled back:\n",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
