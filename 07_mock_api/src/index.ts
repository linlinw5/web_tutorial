import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.ts";
import { resetUsers } from "./data/users.ts";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*", // 允许所有域名访问
    methods: ["GET", "POST", "PUT", "DELETE"], // 允许的HTTP方法
})); // 允许跨域请求
app.use(express.json()); // 处理 application/json
app.use(express.urlencoded({ extended: true })); // 处理 x-www-form-urlencoded
app.use(express.static("public")); // 提供静态文件服务

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Mock API Server</h1>
    <p>We provide following JSON api:</p>
    <p> <a href="/api/users" target="_blank">/api/users</a> : get all users</p>
    <p> <a href="/api/users/1" target="_blank">/api/users/1</a> : get single user details, userId can be variable</p>
    <p> /api/users : post a new user, JSON body format: {"name": "Ada", "email": "ada@abc.com"}</p>
    <p> /api/users/1 : delete a user, userId can be variable</p>
    <p> /api/users/1 : update a user, use PUT method, JSON body format: {"name": "Ada", "email": "ada@abc.com"}, userId can be variable</p>
    <br/>
    <h2>Additional Features</h2>
    <p> <a href="/reset">reset user data</a> : reset the users data to initial state</p>
    `);
});

app.get("/reset", (req, res) => {
  // Reset the users data to initial state
    resetUsers();
    res.redirect("/?info=Users%20data%20has%20been%20reset%20to%20initial%20state.");
});

app.use("/api/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});