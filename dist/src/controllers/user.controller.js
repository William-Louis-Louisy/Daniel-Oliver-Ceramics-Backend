"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const user_validator_1 = require("../validators/user.validator");
// Create Token
const maxAge = 30 * 24 * 60 * 60;
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};
// User controller
exports.userController = {
    createUser: async function (req, res) {
        try {
            const parsed = user_validator_1.userValidator.safeParse(req.body);
            if (!parsed.success) {
                const details = parsed.error.issues.map((i) => ({
                    path: i.path.join("."),
                    message: i.message,
                    code: i.code,
                }));
                return res.status(400).json({ error: "Validation failed", details });
            }
            const { name, email, password } = parsed.data;
            const existingUser = await user_model_1.default.findOne({ email }).lean();
            if (existingUser) {
                return res
                    .status(409)
                    .json({ error: "User with this email already exists" });
            }
            const user = await user_model_1.default.create({ name, email, password });
            const userId = String(user._id);
            const token = createToken(userId);
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: maxAge * 1000,
            });
            res.status(201).json({ user: userId });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    },
    retrieveUsers: async function (req, res) {
        try {
            const users = await user_model_1.default.find({}, { password: 0 });
            res.status(200).json(users);
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    },
    updateUser: async function (req, res) {
        const { userId } = req.params;
        const { name, email } = req.body;
        if (!name && !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        try {
            const user = await user_model_1.default.findByIdAndUpdate(userId, { name, email }, { new: true });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    },
    deleteUser: async function (req, res) {
        const { userId } = req.params;
        try {
            if (!req.userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (req.userId !== userId) {
                return res
                    .status(403)
                    .json({ error: "Forbidden: you can only delete your own account" });
            }
            const user = await user_model_1.default.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
            });
            res.status(200).json({ message: "Account successfully deleted" });
        }
        catch (err) {
            res.status(400).json({ error: err });
        }
    },
    login: async function (req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        try {
            const user = await user_model_1.default.login(email, password);
            const userId = String(user._id);
            const token = createToken(userId);
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: maxAge * 1000,
            });
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            const isBadCred = message === "Incorrect email" || message === "Incorrect password";
            return res.status(isBadCred ? 401 : 400).json({ error: message });
        }
    },
    logout: function (req, res) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "User logged out" });
    },
    checkAuth: async function (req, res) {
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await user_model_1.default.findById(req.userId).select("-password");
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    },
};
