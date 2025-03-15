// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já registrado' });
        }

        // Cria hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Cria novo usuário
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Gera token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user.id, username, email } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca usuário
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verifica senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gera token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, email } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

module.exports = router;