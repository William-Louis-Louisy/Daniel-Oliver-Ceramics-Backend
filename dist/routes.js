"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
function setupRoutes(app) {
    app.use(user_routes_1.default);
}
