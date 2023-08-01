import bodyParser from 'body-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { logger } from './utils/logger';
import cors from 'cors';
import './utils/connectDB';
import deserializeToken from './middleware/deserializeToken';

const app: Application = express();
const port: Number = 4000;
// Parse body request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use(deserializeToken);

// Add logger to all request
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request ${req.method} ${req.originalUrl}`);
  next();
});

routes(app);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
