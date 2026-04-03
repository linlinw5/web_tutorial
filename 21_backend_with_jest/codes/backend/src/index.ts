import { createApp } from "./utils/createApp.ts";
import { options, PORT } from "./config.ts";

async function startServer() {
    try {
        // Create app
        const app = await createApp(options);

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Start server
startServer();
