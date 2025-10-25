import { home } from '@controllers/app.controller';
import { Router } from 'express';
import authRouter from './auth/auth.route';
import unauthRouter from './unauth/unauth.route';

const router = Router();

router.get('/', home);

router.use('/auth', authRouter);

router.use('/', unauthRouter);

export default router;
