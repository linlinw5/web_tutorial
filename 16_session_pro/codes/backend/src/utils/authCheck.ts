import { Request, Response, NextFunction } from "express";

// 定义中间件函数

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // 检查用户是否已登录
  if (req.session.user) {
    // 如果已登录，继续处理请求
    return next();
  }
  // 如果未登录，重定向到登录页面
  res.redirect("/auth/login");
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 检查用户是否已登录且是管理员
  if (req.session.user && req.session.user.group_id === 1) {
    // 如果是管理员，继续处理请求
    return next();
  }
  // 如果不是管理员，返回403 Forbidden错误
  res.status(403).render("error", {
    title: "Access Denied",
    image_name: "403.png",
    user: req.session.user,
  });
};
