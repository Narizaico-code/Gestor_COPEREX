import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import companyRoutes from '../src/companies/company.routes.js';

const app = express();
const BASE_PATH = '/api/v1';

app.use(helmet(helmetConfiguration));
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

app.get(`${BASE_PATH}/health`, (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'up',
    service: 'gestor-coperex-api',
    timestamp: new Date().toISOString(),
  });
});

app.use(`${BASE_PATH}/companies`, companyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

export default app;
