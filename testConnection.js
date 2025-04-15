require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres',
  port: process.env.DB_PORT || 5432
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida!');
  })
  .catch((error) => {
    console.error('Não foi possível conectar ao banco de dados:', error);
  });