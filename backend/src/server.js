require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const pieceRoutes = require('./routes/pieceRoutes');
const clientRoutes = require('./routes/clientRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { ensureAdminExists } = require('./config/adminSetup');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use('/api/auth', authRoutes);
app.use('/api/pieces', pieceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    await ensureAdminExists();
    console.log('MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  });