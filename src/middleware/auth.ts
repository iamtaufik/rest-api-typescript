import { Request, Response, NextFunction } from 'express';

export const requiredUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  return next();
};

export const requiredAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user || user._doc.role !== 'admin') {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  return next();
};
