import express from "express";
import helmet from "helmet";
import { rateLimiter, authMiddleware } from "./middleware/auth.js";

import PingRoute from "./routes/ping.routes.js";
import AIRoutes from "./routes/ai.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

app.use("/ping", PingRoute);
app.use("/ai", authMiddleware, AIRoutes);

export default app;
