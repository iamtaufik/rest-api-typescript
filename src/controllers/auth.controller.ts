import { Request, Response } from 'express';
import { createSessionValidation, createUserValidation, refreshSessionValidation } from '../validations/auth.validation';
import { v4 as uuid } from 'uuid';
import { logger } from '../utils/logger';
import { checkPassword, hashing } from '../utils/hashing';
import { createUser, findUserByEmail } from '../services/auth.service';
import { ErrorType } from '../types/error.types';
import { signJWT, verivyJWT } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuid();
  const { error, value } = createUserValidation(req.body);
  try {
    if (error) {
      logger.error('ERR Auth= Register', error.details[0].message);
      throw new ErrorType(error.details[0].message, 422);
    }
    value.password = hashing(value.password);
    await createUser(value);

    return res.status(201).json({ status: true, statusCode: 201, message: 'Success register ' });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR Auth= Register', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    logger.error('ERR Auth= Register', error.message);
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body);
  try {
    if (error) {
      logger.error('ERR Auth= Create Session', error.details[0].message);
      throw new ErrorType(error.details[0].message, 422);
    }

    const user: any = await findUserByEmail(value.email);

    if (!user) {
      logger.error('ERR Auth= Create Session', 'User not found');
      throw new ErrorType('User not found', 404);
    }

    const isValid = checkPassword(value.password, user.password);

    if (!isValid) {
      logger.error('ERR Auth= Create Session', 'Invalid email or password');
      throw new ErrorType('Invalid email or password', 401);
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' });

    const refreshToken = signJWT({ ...user }, { expiresIn: '7d' });

    return res.status(200).json({ status: true, statusCode: 200, message: 'Success login', data: { accessToken, refreshToken } });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR Auth= Create Session', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    logger.error('ERR Server= Error Server Create Session', error.message);
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidation(req.body);
  try {
    if (error) {
      logger.error('ERR Auth= Register', error.details[0].message);
      throw new ErrorType(error.details[0].message, 422);
    }

    const { decoded }: any = verivyJWT(value.refreshToken);

    const user = await findUserByEmail(decoded._doc.email);

    if (!user) throw new ErrorType('User not found', 404);

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' });
    return res.status(200).json({ status: true, statusCode: 200, message: 'Success login', data: { accessToken } });
  } catch (error: any) {
    if (error instanceof ErrorType) {
      logger.error('ERR Auth= Create Session', error.message);
      return res.status(error.statusCode).json({ status: false, statusCode: error.statusCode, message: error.message });
    }
    logger.error('ERR Auth= Create Session', error.message);
    return res.status(500).json({ status: false, statusCode: 500, message: error.message });
  }
};
