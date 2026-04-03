import express from "express";
import { getAllGroups } from "../db/groups.ts";
import { isAuthenticated, isAdmin } from "../utils/authCheck.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    user: req.session.user,
  });
});

router.get("/register", async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.render("register", {
      title: "Register User",
      groups,
      script_name: "register.js",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect to the profile page
  if (req.session.user) {
    res.redirect("/auth/profile");
  } else {
    // Otherwise, render the login page
    res.render("login", {
      title: "Login",
      user: req.session.user,
      script_name: "login.js",
    });
  }
});

router.get("/profile", isAuthenticated, (req, res) => {
  // If the user is not logged in, redirect to the login page
  // if (!req.session.user) {
  //     return res.redirect("/auth/login");
  // }

  // Render the profile page
  res.render("profile", {
    title: "Profile",
    user: req.session.user,
    sessionID: req.sessionID,
  });
});

router.get("/logout", (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Could not log out.");
    } else {
      res.clearCookie("easyblog.sid");
      res.redirect("/auth");
    }
  });
});

router.get("/admin", isAdmin, (req, res) => {
  // Check whether the user is logged in
  // if (req.session.user && req.session.user.group_id === 1) {
  //     res.render("admin", {
  //         title: "Admin Dashboard",
  //         user: req.session.user,
  //     });
  // } else {
  //     res.status(403).render("error", {
  //         title: "Access Denied",
  //         image_name: "403.jpg",
  //         user: req.session.user,
  //     });
  // }

  res.render("admin", {
    title: "Admin Dashboard",
    user: req.session.user,
  });
});

export default router;
