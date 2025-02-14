require('dotenv').config(); // Carrega as variáveis do .env

const { Sequelize } = require('sequelize');

// Configuração do Sequelize com variáveis de ambiente
const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres',
  port: process.env.DB_PORT || 5432
});

// Testa a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida!');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });
