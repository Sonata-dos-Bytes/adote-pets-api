import { home } from '@controllers/app.controller';
import { Router } from 'express';
import authRouter from './auth/auth.route';
import petRouter from './pet/pet.route';



const router = Router();

router.get('/', home);

router.use('/auth', authRouter);

router.use('/pet', petRouter);

export default router;
