import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../utils/logger';

export const healthRouter: Router = Router();

healthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Health check success');
  res.status(200).json({ status: '200' });
});
