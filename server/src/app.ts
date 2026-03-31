import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { routes } from './routes/index.js';

const app = express();

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// CORS — restrict to allowed origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use(errorHandler);

export { app };
