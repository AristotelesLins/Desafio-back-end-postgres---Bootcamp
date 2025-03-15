const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
app.use(express.json()); // Já faz o papel do body-parser
app.use(routes);

app.use('/auth', authRoutes);
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    console.log('📌 Banco de dados sincronizado!');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
}).catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
});