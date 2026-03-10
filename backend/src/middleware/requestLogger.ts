import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger.js';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl } = req;
  const n = Date.now();

  res.on('finish', () => {
    const { statusCode } = res;
    const dur = Date.now() - n;
    logger.http(`${method} ${originalUrl} ${statusCode} - ${dur}ms`);
  });

  next();
};

export default requestLogger;
