import express from 'express';

import { PORT } from './config/index.js'; 
import { setupServer } from './config/server.js';

import appRouter from './routes/app.route.js';
import { errorHandler } from './exceptions/errorHandler.js';
import { PrismaClient } from '@prisma/client';
import { connectDatabase } from '@config/database.js';
import { logger } from '@config/logger.js';
import multer from 'multer';

const app = express();

// Setup do servidor
setupServer(app);

// Rotas
app.use(appRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Not Found' });
});

// Exceptions Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📚 Documentation available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();