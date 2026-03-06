import express from "express"

import PingRoute from "./routes/ping.routes.js"

const app = express();

app.use(express.json())
app.use("/ping", PingRoute)

export default app
