import { Request, Response, NextFunction } from "express";

// TODO 1: 实现 isAuthenticated 中间件
// - 检查 req.session.user 是否存在
// - 存在则 next()，不存在则重定向到 /auth/login
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // ...
};

// TODO 2: 实现 isAdmin 中间件
// - 检查 req.session.user 是否存在，且 group_id === 1
// - 满足条件则 next()
// - 不满足则 res.status(403).render("error", { title, image_name, user })
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // ...
};
