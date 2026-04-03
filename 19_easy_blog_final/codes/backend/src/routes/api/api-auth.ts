import express from "express";
import passport from "passport";
import { createUser, checkPassword } from "../../db/users.ts";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password, email, group_id } = req.body;
    if (!username || !password || !email || !group_id) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    
    try {
        const newUser = await createUser(username, password, email, group_id);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        if ((error as Error).message === "Username or email already exists") {
            res.status(409).json({ error: (error as Error).message });
            return;
        }
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

router.post("/login", async (req, res) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        const response = {
            success: false,
            message: '',
            data: null as any,
            error: null as any
        }
        if (err) {
            console.error("Authentication error:", err);
            response.error = "Authentication failed";
            return res.status(500).json(response);
        }
        if (!user) {
            response.message = info.message || "Invalid credentials";
            return res.status(401).json(response);
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error("Login error:", loginErr);
                response.error = "Login failed";
                return res.status(500).json(response);
            }
            response.success = true;
            response.message = "Login successful";
            response.data = {
                id: user.id,
                username: user.username,
                email: user.email,
                group_id: user.group_id,
                google_id: user.google_id,
                avatar: user.avatar,
                provider: user.provider
            };
            return res.status(200).json(response);
        });
    })(req, res);
});



export default router;