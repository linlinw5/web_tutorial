import { createApp } from "./utils/createApp.ts";
import { options, PORT } from "./config.ts";

async function startServer() {
    try {
        // 创建应用
        const app = await createApp(options);

        // 启动服务器
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// 启动服务器
startServer();
