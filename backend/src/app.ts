import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './config/logger';

// Import Route Modules
import authRoutes from './modules/auth/auth.routes';
import customerRoutes from './modules/customers/customer.routes';
import productRoutes from './modules/products/product.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import challanRoutes from './modules/challans/challan.routes';
import userRoutes from './modules/users/user.routes';

// Import Centralized Error Handler
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Dynamic CORS Middleware supporting credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any requesting origin dynamically to satisfy browser CORS & credentials rules
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mini-erp-crm-api',
  });
});

// Mount Modular API Routes (Both /api/v1/ and root prefixes for compatibility)
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/v1/customers', customerRoutes);
app.use('/customers', customerRoutes);

app.use('/api/v1/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/v1/inventory', inventoryRoutes);
app.use('/inventory', inventoryRoutes);

app.use('/api/v1/challans', challanRoutes);
app.use('/challans', challanRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/users', userRoutes);

// 404 Handler for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested API endpoint does not exist',
    },
  });
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
