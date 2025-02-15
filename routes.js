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
router.post('/tasks/:taskId/tags', async (req, res) => {
    const { tagId } = req.body;  // Pega o tagId do corpo da requisição
    const task = await Task.findByPk(req.params.taskId);
    const tag = await Tag.findByPk(tagId);

    if (!task || !tag) return res.status(404).json({ error: 'Task or Tag not found' });

    await task.addTags([tag]);  // Associa a tag à tarefa
    res.json({ message: 'Tag adicionada à tarefa' });
});


// Listar tags
router.get('/tags', async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

// Atualizar tag
router.put('/tags/:id', async (req, res) => {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    await tag.update(req.body);
    res.json(tag);
});

// Deletar tag
router.delete('/tags/:id', async (req, res) => {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    await tag.destroy();
    res.status(204).send();
});

// Desatrelar tag de uma tarefa
router.delete('/tasks/:taskId/tags/:tagId', async (req, res) => {
    const task = await Task.findByPk(req.params.taskId);
    const tag = await Tag.findByPk(req.params.tagId);

    if (!task || !tag) return res.status(404).json({ error: 'Task or Tag not found' });

    await task.removeTags([tag]);  // Desassocia a tag da tarefa
    res.json({ message: 'Tag desassociada da tarefa' });
});

// Filtrar tarefas por tag
router.get('/tasks/filter', async (req, res) => {
    const { tags } = req.query; // Captura o valor da query "tags"

    if (!tags) {
        return res.status(400).json({ error: 'Tag name is required' });
    }

    try {
        const tasks = await Task.findAll({
            include: {
                model: Tag,
                where: { name: tags }, // Filtra tarefas pela tag
                attributes: ['id', 'name'], // Retorna apenas o id e nome da tag
            },
            attributes: ['id', 'title', 'status', 'priority', 'description', 'createdAt', 'updatedAt'], // Retorna apenas os campos da tarefa
            raw: true, // Retorna as tarefas "cruas", sem incluir detalhes de associações extras
        });

        // Filtra a resposta para garantir que apenas os campos necessários da tarefa sejam retornados
        const filteredTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            description: task.description,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            Tags: task.Tags ? task.Tags.map(tag => ({
                id: tag.id,
                name: tag.name
            })) : []
        }));

        res.json(filteredTasks);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});




module.exports = router;
