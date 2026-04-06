import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "./config/db.js";
import { getClientUrls, getMongoUri } from "./config/env.js";
import { loadEnv } from "./config/loadEnv.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { employeeRoutes } from "./routes/employee.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";
import { attendanceRoutes } from "./routes/attendance.routes.js";
import { leaveRoutes } from "./routes/leave.routes.js";
import { payrollRoutes } from "./routes/payroll.routes.js";
import { notificationRoutes } from "./routes/notification.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { settingsRoutes } from "./routes/settings.routes.js";
import { auditLogRoutes } from "./routes/auditLog.routes.js";
import { attachSocket } from "./services/socketHub.js";

const { mode, loadedFiles } = loadEnv();

const app = express();
const server = http.createServer(app);

const CLIENT_URLS = getClientUrls();
const corsOrigin = CLIENT_URLS.length === 1 ? CLIENT_URLS[0] : CLIENT_URLS;

const io = new SocketIOServer(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

attachSocket(io);

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimiter());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Dayflow server healthy",
    data: {
      env: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      loadedEnvFiles,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/audit-logs", auditLogRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

async function bootstrap() {
  try {
    await connectDB(getMongoUri());
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Dayflow API listening on :${PORT} (${mode}) for ${CLIENT_URLS.join(", ")}`
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

bootstrap();
