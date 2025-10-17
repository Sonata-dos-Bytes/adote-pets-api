import { signup, login } from '@controllers/auth.controller';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    login(req, res, next).catch(next);
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    signup(req, res, next).catch(next);
});

export default router;
