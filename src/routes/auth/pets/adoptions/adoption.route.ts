import { createAdoptionRequest } from '@controllers/adoption.controller';
import { Router } from 'express';


const router = Router();

router.post("/adoption", createAdoptionRequest);

export default router;
