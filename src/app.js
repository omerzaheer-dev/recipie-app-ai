import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // fallback to avoid issues
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// ✅ Test route (IMPORTANT to prevent empty app confusion)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Routes
import { userRoutes, mainRoutes } from "./routes/index.js";
app.use("/api/users", userRoutes);
app.use(
  "/api/main/docs",
  swaggerUi.serveFiles(swaggerDocument),
  swaggerUi.setup(swaggerDocument)
);
app.get("/api/main/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});
app.use("/api/main", mainRoutes);

// ✅ Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// ✅ Export app (DO NOT start server here)
export { app };