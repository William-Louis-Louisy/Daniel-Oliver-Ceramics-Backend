"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidator = void 0;
const zod_1 = require("zod");
exports.userValidator = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
