import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import env from './config/environment.js';
import authRoutes from './routes/auth.routes.js';
import dogsRoutes from './routes/dogs.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/upload', uploadRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: env.isDev ? err.message : 'Internal server error',
  });
});

export default app;
