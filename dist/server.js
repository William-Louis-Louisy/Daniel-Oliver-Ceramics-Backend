"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./src/config/db");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
const allowedOrigins = new Set([process.env.FRONTEND_URL]);
const corsOptions = {
    origin(origin, cb) {
        if (!origin)
            return cb(null, true);
        let hostname = null;
        try {
            hostname = new URL(origin).hostname;
        }
        catch {
            hostname = null;
        }
        const ok = allowedOrigins.has(origin) ||
            (hostname != null && /\.vercel\.app$/i.test(hostname));
        return cb(ok ? null : new Error("CORS: Origin not allowed"), ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
    preflightContinue: false,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, routes_1.setupRoutes)(app);
const PORT = Number(process.env.PORT) || 5000;
(0, db_1.connectDB)().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
    const shutdown = async () => {
        console.log("🔴 Server is shutting down gracefully...");
        server.close(async () => {
            await (0, db_1.disconnectDB)();
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
});
