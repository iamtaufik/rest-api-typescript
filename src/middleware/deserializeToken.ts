import { Request, Response, NextFunction } from 'express';
import { verivyJWT } from '../utils/jwt';

const deserializeToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return next();
  }
  const token = verivyJWT(accessToken);
  if (token.decoded) {
    res.locals.user = token.decoded;
    return next();
  }

  if (token.expired) {
    return next();
  }

  return next();
};

export default deserializeToken;
