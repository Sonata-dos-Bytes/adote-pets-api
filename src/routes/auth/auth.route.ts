import { signup, login, me } from '@controllers/auth.controller';
import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';

const router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    login(req, res, next).catch(next);
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    signup(req, res, next).catch(next);
});

router.get('/me', [authMiddleware], (req: Request, res: Response, next: NextFunction) => {
    me(req, res, next).catch(next);
});

export default router;
