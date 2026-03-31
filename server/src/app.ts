import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler.js';
import { routes } from './routes/index.js';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export { app };
