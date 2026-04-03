import express from "express";
import { closeConnection } from "./db/ConnectionManager.ts";
import { blogs as apiBlogsRoute } from "./routes/api/index.ts";

const app = express();
const PORT = 3000;

app.use(express.static("public")); // Set static files directory
app.set("view engine", "ejs"); // Set view engine
app.set("views", "views"); // Set views directory - where EJS templates are stored

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.get("/", (req, res) => { 
    res.render("home.ejs", { title: "Home Page" });
});

// Configure API routes
app.use("/api/blogs", apiBlogsRoute);

// Handle missing routes
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        image_name: "404.jpg",
    });
});

// Gracefully close the database connection when SIGINT or SIGTERM is received
process.on("SIGINT", async () => {
    console.log("Received SIGINT. Shutting down gracefully...");
    await closeConnection();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Shutting down gracefully...");
    await closeConnection();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
