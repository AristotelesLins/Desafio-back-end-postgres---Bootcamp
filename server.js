require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log('📌 Banco de dados conectado!');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
});
