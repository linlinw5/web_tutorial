import express from "express";
import { ConnectionManager } from "../db/ConnectionManager.ts";
import { blogs as apiBlogsRoute } from "../routes/api/index.ts";
import type { AppOptions } from "../types/index.ts";

export async function createApp(options: AppOptions) {
  // 从配置中获取数据库环境选项
  const { env } = options;

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 设置路由
  app.use("/api/blogs", apiBlogsRoute);

  // 处理未找到的路由
  app.use((req, res) => {
    res.status(404).json({ error: "Web not enabled, API mode only, please try '/api/blogs'" });
  });

  // 获取当前环境的数据库实例
  const dbManager = ConnectionManager.getInstance(env);
  // 初始化数据库表结构
  await dbManager.initializeDatabase();
  // 当接收到 SIGINT 或 SIGTERM 信号时，优雅地关闭数据库连接
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
