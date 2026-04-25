// server.js — Servidor principal da API
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
const creditRouter = require('./routes/credit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/credit', creditRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'CréditoAutônomo API v1.0' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 CréditoAutônomo API rodando em http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
