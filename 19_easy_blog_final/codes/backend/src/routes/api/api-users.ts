import express from "express";
import { User } from "../../models/User.ts";
import { getUserById, createUser, deleteUser, updateUser } from "../../db/users.ts";

const router = express.Router();

// 查单个用户
router.get("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const user = await getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// 创建用户（管理员操作）
router.post("/", async (req, res) => {
    const { username, email, password, group_id = 3 } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Name, email, and password are required" });
        return;
    }
    try {
        const newUser = await createUser(username, password, email, Number(group_id));
        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        if ((error as Error).message === "Username or email already exists") {
            res.status(409).json({ error: (error as Error).message });
            return;
        }
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// 删除用户
router.delete("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    if (userId === (req.user as User).id) {
        res.status(403).json({ message: "You cannot delete your own account" });
        return;
    }
    try {
        const deleted = await deleteUser(userId);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// 修改密码
router.patch("/:id", async (req, res) => {
    const userId = Number(req.params.id);
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
    }
    try {
        const result = await updateUser(userId, { password });
        if (result) {
            res.status(200).json({ success: true, message: "User password updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ error: "Failed to update user password" });
    }
});

export default router;
