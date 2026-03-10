import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('[Auth] No token provided');
  }

  const token = authHeader.split(' ')[1];
  if (token !== process.env.BEARER) {
    return res.status(403).send('[Auth] Invalid token');
  }

  next();
};
