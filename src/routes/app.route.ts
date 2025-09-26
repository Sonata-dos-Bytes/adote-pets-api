import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import apiRouter from './api.route';

const router = Router();

router.get('/favicon.ico', (req, res) => {
    res.sendFile(path.resolve("./src/static/favicon.ico"));
});

// Routes application
router.use('/api', apiRouter);

export default router;
