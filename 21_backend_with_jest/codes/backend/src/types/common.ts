// Environment type definition - concise union type
export type Environment = "dev" | "prod" | "test";

// Database path config type - ensure keys match Environment
export type DatabasePaths = Record<Environment, string>;

// Application configuration options
export interface AppOptions {
  env?: Environment;
}

// Generic API response type
// Response for create/delete/update operations
export interface CUDResponse {
  success: boolean;
  message?: string;
  error?: string;
}
