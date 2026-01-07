"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.requireAuth = requireAuth;
