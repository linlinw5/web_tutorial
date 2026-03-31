import express from "express";
import { gracefulShutdown } from "./utils/shutdownConnection.ts";
import { users as apiUsers, blogs as apiBlogs } from "./routes/api/index.ts";
import { users as webUsers } from "./routes/web/index.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the SQLite API Pro Demo!</h1>
        <p><a href="/users?limit=10&offset=0">View Users (SSR — EJS)</a></p>
        <p><a href="/users/js">View Users (CSR — JS Fetch)</a></p>
    `);
});

// API 路由
app.use("/api/users", apiUsers);
app.use("/api/blogs", apiBlogs);

// Web 路由
app.use("/users", webUsers);

// 兜底 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

gracefulShutdown();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
