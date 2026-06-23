require('pg'); // force nft to include pg in the serverless bundle
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { geral } = require('./middlewares/rateLimiter');
const { handleSequelizeError } = require('./utils/errorHandler');

const app = express();

// Necessário atrás de proxy (ex.: Vercel) para o rate limit e o IP do cliente funcionarem
app.set('trust proxy', 1);
app.use(helmet());
app.use(geral);

// Aceita uma ou várias origens separadas por vírgula em CORS_ORIGIN
const origensPermitidas = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim());

app.use(cors({
  origin: origensPermitidas,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  const error = handleSequelizeError(err);
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${error.message}`);
  }

  res.status(statusCode).json({
    error: {
      message: error.message || 'Erro interno do servidor',
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

module.exports = app;
