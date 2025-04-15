const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const routes = require('./routes');
const cors = require('cors'); // Adicione esta linha

require('dotenv').config();

const app = express();

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:3001',
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', routes);

const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  sequelize.authenticate().then(() => {
    console.log('📌 Banco de dados conectado!');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  }).catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  });
} else {
  sequelize.sync({ alter: true }).then(() => {
    console.log('📌 Banco de dados sincronizado!');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  }).catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  });
}