import express from "express";
import { ConnectionManager } from "../db/ConnectionManager.ts";
import { blogs as apiBlogsRoute } from "../routes/api/index.ts";
import type { AppOptions } from "../types/index.ts";

export async function createApp(options: AppOptions) {
  // Get DB environment option from config
  const { env } = options;

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set routes
  app.use("/api/blogs", apiBlogsRoute);

  // Handle unmatched routes
  app.use((req, res) => {
    res.status(404).json({ error: "Web not enabled, API mode only, please try '/api/blogs'" });
  });

  // Get the database instance for the current environment
  const dbManager = ConnectionManager.getInstance(env);
  // Initialize database schema
  await dbManager.initializeDatabase();
  // Gracefully close DB connection on SIGINT or SIGTERM
  process.on("SIGINT", async () => {
    console.log("Received SIGINT. Shutting down gracefully...");
    await dbManager.closeConnection();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Shutting down gracefully...");
    await dbManager.closeConnection();
    process.exit(0);
  });

  return app;
}
