// 环境类型定义 - 简洁的联合类型
export type Environment = "dev" | "prod" | "test";

// 数据库路径配置类型 - 确保key与Environment一致
export type DatabasePaths = Record<Environment, string>;

// 应用配置选项
export interface AppOptions {
  env?: Environment;
}

// 通用的 API 响应类型
// 用于增删改操作的响应
export interface CUDResponse {
  success: boolean;
  message?: string;
  error?: string;
}
