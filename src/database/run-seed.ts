import { seedDatabase } from "./seed";

seedDatabase()
  .then(() => {
    console.log("Database seeded successfully.");
  })
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  });
