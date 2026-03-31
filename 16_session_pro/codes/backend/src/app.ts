import express from "express";
import session from "express-session";
// @ts-ignore
import connectSqlite3 from "connect-sqlite3"; // 这个包的ts类型定义可能不完整，所以需要忽略ts检查
import authRoutes from "./routes/auth.ts";
import apiAuthRoutes from "./routes/api_auth.ts";
import { gracefulShutdown } from "./utils/shutdownConnection.ts";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
      group_id: number;
      groupname: string;
    };
  }
}

const app = express();
const PORT = 3000;
const SQLiteStore = connectSqlite3(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    secret: "topsecret",
    resave: false,
    saveUninitialized: false,
    name: "easyblog.sid",
    cookie: { maxAge: 5 * 60 * 1000 },
    store: new SQLiteStore({
      db: "sessions.db",
      table: "sessions",
      dir: "./data",
      concurrentDB: true,
    }),
  }),
);

// 路由处理
app.get("/", (req, res) => res.redirect("/auth"));

app.use("/auth", authRoutes);
app.use("/api/auth", apiAuthRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("error", { title: "Page Not Found", image_name: "404.png", user: req.session.user });
});

gracefulShutdown();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
