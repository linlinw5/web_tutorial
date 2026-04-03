import { Request, Response, NextFunction } from "express";

// Define middleware functions

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Check whether the user is logged in
  if (req.session.user) {
    // If logged in, continue handling the request
    return next();
  }
  // If not logged in, redirect to the login page
  res.redirect("/auth/login");
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check whether the user is logged in and is an admin
  if (req.session.user && req.session.user.group_id === 1) {
    // If admin, continue handling the request
    return next();
  }
  // If not admin, return 403 Forbidden
  res.status(403).render("error", {
    title: "Access Denied",
    image_name: "403.png",
    user: req.session.user,
  });
};
