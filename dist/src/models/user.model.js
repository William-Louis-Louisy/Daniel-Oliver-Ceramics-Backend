"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
// Schema
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, required: true, minlength: 8 },
}, { timestamps: true, versionKey: false });
// Middleware to hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcrypt_1.default.genSalt();
    this.password = await bcrypt_1.default.hash(this.password, salt);
});
// Login
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user)
        throw new Error("Incorrect email");
    const auth = await bcrypt_1.default.compare(password, user.password);
    if (!auth)
        throw new Error("Incorrect password");
    return user;
};
// To JSON
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
exports.default = (0, mongoose_1.model)("User", UserSchema);
