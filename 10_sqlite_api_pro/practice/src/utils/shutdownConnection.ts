import { closeConnection } from "../db/ConnectionManager.ts";

export function gracefulShutdown() {
    process.on("SIGINT", async () => {
        console.log("Received SIGINT, closing database connection...");
        await closeConnection();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Received SIGTERM, closing database connection...");
        await closeConnection();
        process.exit(0);
    });
}
