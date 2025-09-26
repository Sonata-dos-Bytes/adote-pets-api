import { signup } from '@controllers/auth.controller';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    // Implement login logic here
    res.send('Login route');
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    signup(req, res, next).catch(next);
});

export default router;
