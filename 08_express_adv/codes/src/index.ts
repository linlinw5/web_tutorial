import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// ===== 8.4 CORS 配置 =====
// origin 指定允许跨域访问的来源，只有匹配的域名才会收到 Access-Control-Allow-Origin 响应头
// 使用 VS Code Live Server 时前端运行在 http://localhost:5500
const corsOptions = {
    origin: "http://localhost:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
};

// ===== 8.3 中间件配置 =====
app.use(cors(corsOptions));                      // 跨域支持
app.use(express.json());                         // 解析 application/json 请求体
app.use(express.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded 请求体
app.use(express.static("public"));               // 静态文件（头像图片）

// ===== 数据层：内存模拟数据库 =====

interface User {
    id: number;
    name: string;
    email: string;
    image: string;
}

let users: User[] = [
    { id: 1, name: "Tom",   email: "tom@abc.com",   image: "/images/tom.png" },
    { id: 2, name: "Jerry", email: "jerry@abc.com", image: "/images/jerry.png" },
    { id: 3, name: "Spike", email: "spike@abc.com", image: "/images/spike.png" },
];

// ===== 8.5 路由：完整 CRUD =====

app.get("/", (req, res) => {
    res.send("Welcome to the User API");
});

// 获取所有用户
app.get("/api/users", (req, res) => {
    console.log("收到请求头:", req.headers);
    res.json(users);
});

// 获取单个用户
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user: User | undefined = users.find((u) => u.id === id);
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// 新增用户
app.post("/api/users", (req, res) => {
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("请求体:", req.body);
    const { name, email } = req.body;
    const newUser: User = {
        id: Date.now(),
        name,
        email,
        image: "/images/default.png",
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 修改用户
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const user: User | undefined = users.find((u) => u.id === id);
    if (user) {
        user.name = name;
        user.email = email;
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// 删除用户
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((u) => u.id === id);
    if (index >= 0) {
        users.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// 404 兜底路由
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});

app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
});
