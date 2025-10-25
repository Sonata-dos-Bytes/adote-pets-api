import { signup, login, me, updateProfile } from '@controllers/auth.controller';
import { Router } from 'express';
import authMiddleware from 'src/middlewares/auth.middleware';
import petRouter from './pet/pet.route';

const router = Router();

router.use('/pets', petRouter);

export default router;
