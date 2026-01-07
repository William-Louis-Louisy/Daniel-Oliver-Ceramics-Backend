"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }
    try {
        await mongoose_1.default.connect(`${process.env.MONGO_URI}`, {
            autoIndex: process.env.NODE_ENV !== "production",
        });
        console.log("🟢 Connected to database");
    }
    catch (err) {
        console.error("🔴 Database connection error:", err);
        process.exit(1);
    }
}
async function disconnectDB() {
    await mongoose_1.default.connection.close();
    console.log("🔴 Database connection closed");
}
