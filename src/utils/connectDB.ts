import mongoose from 'mongoose';
import config from '../config/enviroment';
import { logger } from './logger';

mongoose
  .connect(`${config.db}`)
  .then(() => {
    logger.info('DB connected');
  })
  .catch((err) => {
    logger.error('DB connection error: ', err);
    process.exit(1);
  });
