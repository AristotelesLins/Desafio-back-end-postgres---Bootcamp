const express = require('express');
const { Task, Tag } = require('./models');

const router = express.Router();

// Criar tarefa
router.post('/tasks', async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

// Listar tarefas
router.get('/tasks', async (req, res) => {
    const tasks = await Task.findAll({ include: Tag });
    res.json(tasks);
});

// Editar tarefa
router.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.update(req.body);
    res.json(task);
});

// Deletar tarefa
router.delete('/tasks/:id', async (req, res) => {
    await Task.destroy({ where: { id: req.params.id } });
    res.status(204).send();
});

// Criar tag
router.post('/tags', async (req, res) => {
    const tag = await Tag.create(req.body);
    res.json(tag);
});

// Atrelar tags a tarefas
router.post('/tasks/:taskId/tags/:tagId', async (req, res) => {
    const task = await Task.findByPk(req.params.taskId);
    const tag = await Tag.findByPk(req.params.tagId);

    if (!task || !tag) return res.status(404).json({ error: 'Task or Tag not found' });

    await task.addTags([tag]); // Aqui está o erro corrigido!
    res.json({ message: 'Tag adicionada à tarefa' });
});
router.get('/tasks/filter/:tagName', async (req, res) => {
    const tasks = await Task.findAll({
        include: {
            model: Tag,
            where: { name: req.params.tagName }
        }
    });
    res.json(tasks);
});

module.exports = router;
