import { signup, login, me, updateProfile } from '@controllers/auth.controller';
import { Router } from 'express';

import adoptionRoutes from './adoptions/adoption.route';
import petRouter from './pets/pet.route';
import authMiddleware from 'src/middlewares/auth.middleware';

const router = Router();

router.post('/login', login);

router.post('/register', signup);

router.use(authMiddleware);

router.get('/me', me);

router.put('/update-profile', updateProfile);

router.use('/adoptions', adoptionRoutes);

router.use('/pets', petRouter);

export default router;
