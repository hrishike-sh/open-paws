import { Request, Response } from "express";

export const Ping = (req: Request, res: Response) => {
    res.json({
        status: "Pong!",
        uptime: process.uptime()
    })
}