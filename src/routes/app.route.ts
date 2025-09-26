import { home } from '@controllers/app.controller';
import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    home(req, res, next).catch(next);
});

router.get('/favicon.ico', (req, res) => {
    res.sendFile(path.resolve("./src/static/favicon.ico"));
});

export default router;
