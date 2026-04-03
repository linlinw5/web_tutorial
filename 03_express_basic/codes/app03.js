// Demo: EJS template engine + static file hosting
// Run: nodemon codes/app03.js (execute from the 03_express_basic/ directory)
// Visit: http://localhost:3000

import express from "express";
import { blogs } from "./data.js";

const app = express();
const port = 3000;

// Template engine configuration (paths are relative to the run directory, i.e. 03_express_basic/)
app.set("view engine", "ejs");
app.set("views", "./views");

// Static file hosting: files under public/ can be accessed via /css/... and /images/...
app.use(express.static("public"));

// 1. Home page - render blog list
app.get("/", (req, res) => {
  res.render("home.ejs", { title: "Blog Home", blogs });
});

// 2. Blog detail page
app.get("/blog", (req, res) => {
  const blogId = parseInt(req.query.id);
  if (isNaN(blogId)) {
    return res.status(400).render("error.ejs", {
      title: "Error - Invalid Blog ID",
      message: "Please provide a valid blog ID",
    });
  }

  let result;
  for (let item of blogs) {
    if (item.id === blogId) {
      result = item;
      break;
    }
  }

  if (result) {
    res.render("blog.ejs", { blog: result });
  } else {
    res.status(404).render("error.ejs", {
      title: "404 - Page Not Found",
      message: `Blog with ID ${blogId} was not found`,
    });
  }
});

// 3. 404 fallback
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    title: "404 - Page Not Found",
    message: `${req.path} was not found`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
