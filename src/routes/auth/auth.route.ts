import { signup, login, me } from '@controllers/auth.controller';
import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';

const router = Router();

router.post('/login', login);

router.post('/register', signup);

router.get('/me', [authMiddleware], me);

export default router;
