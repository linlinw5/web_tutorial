import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { checkPassword, getUserById, getUserByEmail, getUserByGoogleId, getUserByUsername, createUser, updateUser } from "../db/users.ts";
import { User } from "../models/User.ts";

export function configPassport() {
    // 本地策略
    passport.use('local', new LocalStrategy(
        { usernameField: "username", passwordField: "password" },
        async (username, password, done) => {
            try {
                const result = await checkPassword(username, password);
                if (result.success) {
                    return done(null, result.user);
                }
                return done(null, false, { message: result.message as string });
            }
            catch (error) {
                console.error("Error in LocalStrategy:", error);
                return done(error);
            }
        }
    ));
    // Google 策略
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            let user = await getUserByGoogleId(googleId);
            if (user) {
                return done(null, user);
            }
            
            let email = profile.emails?.[0]?.value || '';
            user = await getUserByEmail(email);
            if (user) {
                // 已有本地账号，将 Google 账号绑定到现有用户（写入 google_id 和 avatar）
                // 注意：updateUser 使用 snake_case 字段名（与数据库列名一致）
                await updateUser(user.id, {
                    google_id: googleId,
                    avatar: profile.photos?.[0]?.value,
                });
                user.google_id = googleId; // 同步更新内存中的用户对象，供后续 serializeUser 使用
                return done(null, user);
            }
            
            // 如果用户不存在，则创建新用户
            const newUser = await createUser(
                profile.displayName,
                '', // Google 用户没有密码
                email,
                2, // 默认分组 ID
                googleId,
                profile.photos?.[0].value,
                'google'
            );
            return done(null, newUser);
        } catch (error) {
            console.error("Error in GoogleStrategy:", error);
            return done(error);
        }
    }));

    // 序列化用户
    passport.serializeUser((user, done) => {
        done(null, (user as User).id);
    });
    // 反序列化用户
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await getUserById(id);
            if (user) {
                done(null, user);
            }
            else {
                done(new Error("User not found"));
            }
        } catch (error) {
            console.error("Error in deserializeUser:", error);
            done(error);
        }
    });
}
