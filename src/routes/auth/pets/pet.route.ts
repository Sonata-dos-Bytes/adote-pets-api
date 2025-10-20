import adoptionRoutes from './adoptions/adoption.route';
import { Router } from 'express';

const router = Router();

router.use('/adoptions', adoptionRoutes);

export default router;
