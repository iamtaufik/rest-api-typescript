import { Router } from 'express';
import { registerUser, createSession, refreshSession } from '../controllers/auth.controller';

export const authRouter: Router = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', createSession);
authRouter.post('/refresh', refreshSession);
