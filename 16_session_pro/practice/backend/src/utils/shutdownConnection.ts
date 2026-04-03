import { ConnectionManager } from "../db/ConnectionManager.ts";

export function gracefulShutdown() {
  process.on("SIGINT", async () => {
    console.log("Received SIGINT, closing database connection...");
    await ConnectionManager.closeConnection();
    console.log("Database connection closed. Exiting process.");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, closing database connection...");
    await ConnectionManager.closeConnection();
    console.log("Database connection closed. Exiting process.");
    process.exit(0);
  });
}
