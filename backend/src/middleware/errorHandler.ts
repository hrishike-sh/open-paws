import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger.js';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.stack}`);
  res.status(500).send('error');
};

export default errorHandler;
