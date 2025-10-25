import { home } from '@controllers/app.controller';
import { Router } from 'express';
import authRouter from './auth/auth.route';
import unauth from './unauth/unauth.route';

const router = Router();

router.get('/', home);

router.use('/auth', authRouter);

router.use('/', unauth);

export default router;
