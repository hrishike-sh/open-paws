import express from "express";
import helmet from "helmet";

import { rateLimiter, authMiddleware } from "./middleware/auth.js";

import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";

import PingRoute from "./routes/ping.routes.js";
import AIRoutes from "./routes/ai.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);

app.use("/ping", PingRoute);
app.use("/ai", authMiddleware, AIRoutes);

app.use(errorHandler);

export default app;
