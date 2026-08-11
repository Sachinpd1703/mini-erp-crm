import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import prisma from './config/database';

const PORT = parseInt(env.PORT, 10) || 5000;

async function bootstrap() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connection established successfully via Prisma.');

    const server = app.listen(PORT, () => {
      logger.info(`Server running in [${env.NODE_ENV}] mode on http://localhost:${PORT}`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database disconnected. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
