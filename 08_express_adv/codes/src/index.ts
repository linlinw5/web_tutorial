import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// ===== 8.4 CORS configuration =====
// origin specifies allowed cross-origin sources; only matching domains receive Access-Control-Allow-Origin
// When using VS Code Live Server, the frontend runs at http://localhost:5500
const corsOptions = {
  origin: "http://localhost:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// ===== 8.3 Middleware configuration =====
app.use(cors(corsOptions)); // Cross-origin support
app.use(express.json()); // Parse application/json request body
app.use(express.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded request body
app.use(express.static("public")); // Static files (avatar images)

// ===== Data layer: in-memory mock database =====

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
}

let users: User[] = [
  { id: 1, name: "Tom", email: "tom@abc.com", image: "/images/tom.png" },
  { id: 2, name: "Jerry", email: "jerry@abc.com", image: "/images/jerry.png" },
  { id: 3, name: "Spike", email: "spike@abc.com", image: "/images/spike.png" },
];

// ===== 8.5 Routes: full CRUD =====

app.get("/", (req, res) => {
  res.send("Welcome to the User API");
});

// Get all users
app.get("/api/users", (req, res) => {
  console.log("Received request headers:", req.headers);
  res.json(users);
});

// Get a single user
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user: User | undefined = users.find((u) => u.id === id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// Add a new user
app.post("/api/users", (req, res) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Request body:", req.body);
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

// Update user
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

// Delete user
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

// 404 fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
