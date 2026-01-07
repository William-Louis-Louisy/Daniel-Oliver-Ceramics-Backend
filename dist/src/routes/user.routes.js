"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
// CREATE USER
userRouter.post("/signup", user_controller_1.userController.createUser);
// RETRIEVE USERS
userRouter.get("/retrieve-users-list", user_controller_1.userController.retrieveUsers);
// UPDATE USER
userRouter.put("/update-user/:userId", user_controller_1.userController.updateUser);
// DELETE USER
userRouter.delete("/delete-user/:userId", user_controller_1.userController.deleteUser);
// LOGIN
userRouter.post("/login", user_controller_1.userController.login);
// LOGOUT
userRouter.post("/logout", user_controller_1.userController.logout);
// CHECK AUTH
userRouter.get("/check-auth", auth_middleware_1.requireAuth, user_controller_1.userController.checkAuth);
exports.default = userRouter;
