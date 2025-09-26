import { home } from '@controllers/app.controller';
import { Router, Request, Response, NextFunction } from 'express';
import authRouter from './auth/auth.route';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    home(req, res, next).catch(next);
});

router.use('/auth', authRouter);

export default router;
