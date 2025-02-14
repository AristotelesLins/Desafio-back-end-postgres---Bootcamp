require('dotenv').config(); // Carrega as variáveis do .env

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    port: process.env.DB_PORT || 5432, // Define a porta do PostgreSQL (padrão 5432)
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + "_test",
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    port: process.env.DB_PORT || 5432,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + "_prod",
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
    port: process.env.DB_PORT || 5432,
  }
};
