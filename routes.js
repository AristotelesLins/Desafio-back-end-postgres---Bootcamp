const express = require('express');
const { Task, Tag } = require('./models');
const { User } = require('./models');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Criar tarefa
router.post('/tasks', async (req, res) => {
  try {
    console.log('Recebendo requisição POST /tasks');
    console.log('Corpo da requisição:', req.body);
    console.log('Usuário autenticado:', req.user);

    // Validação de entrada
    if (!req.body.title || !req.body.status || !req.body.priority || !req.body.description) {
      return res.status(400).json({ error: 'Campos title, status, priority e description são obrigatórios' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.log('Usuário não encontrado:', req.user.id);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    console.log('Tarefa criada com sucesso:', task);
    res.json(task);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Erro ao criar tarefa', details: error.message });
  }
});

// Listar tarefas
router.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.user.id },
    include: Tag
  });
  res.json(tasks);
});

// Editar tarefa
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para editá-la' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error('Erro ao editar tarefa:', error.message);
    res.status(500).json({ error: 'Erro ao editar tarefa', details: error.message });
  }
});

// Deletar tarefa
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para deletá-la' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa', details: error.message });
  }
});

// Criar tag
router.post('/tags', async (req, res) => {
  const tag = await Tag.create(req.body);
  res.json(tag);
});

// Atrelar tags a tarefas
router.post('/tasks/:taskId/tags', async (req, res) => {
  const { tagId } = req.body;

  if (!tagId) {
    return res.status(400).json({ error: 'tagId é obrigatório' });
  }

  const task = await Task.findByPk(req.params.taskId);
  const tag = await Tag.findByPk(tagId);

  if (!task || !(task instanceof Task)) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  if (!tag || !(tag instanceof Tag)) {
    return res.status(404).json({ error: 'Tag não encontrada' });
  }

  try {
    await task.addTags([tag]);
    res.json({ message: 'Tag adicionada à tarefa' });
  } catch (error) {
    console.error('Erro ao associar tag à tarefa:', error);
    res.status(500).json({ error: 'Erro interno ao associar tag à tarefa' });
  }
});

// Listar tags
router.get('/tags', async (req, res) => {
  const tags = await Tag.findAll();
  res.json(tags);
});

// Atualizar tag
router.put('/tags/:id', async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });

  await tag.update(req.body);
  res.json(tag);
});

// Deletar tag
router.delete('/tags/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    await tag.destroy();
    res.status(200).json({ message: 'Tag deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar tag:', error.message);
    res.status(500).json({ error: 'Erro ao deletar tag', details: error.message });
  }
});

// Desatrelar tag de uma tarefa
router.delete('/tasks/:taskId/tags/:tagId', async (req, res) => {
  const task = await Task.findByPk(req.params.taskId);
  const tag = await Tag.findByPk(req.params.tagId);

  if (!task || !tag) return res.status(404).json({ error: 'Tarefa ou Tag não encontrada' });

  await task.removeTags([tag]);
  res.json({ message: 'Tag desassociada da tarefa' });
});

// Filtrar tarefas por tag
router.get('/tasks/filter', async (req, res) => {
  const { tags } = req.query;

  if (!tags) {
    return res.status(400).json({ error: 'Nome da tag é obrigatório' });
  }

  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: {
        model: Tag,
        where: { name: tags },
        attributes: ['id', 'name'],
      },
      attributes: ['id', 'title', 'status', 'priority', 'description', 'createdAt', 'updatedAt'],
    });

    const filteredTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      Tags: task.Tags.map(tag => ({
        id: tag.id,
        name: tag.name
      }))
    }));

    res.json(filteredTasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas', details: err.message });
  }
});

module.exports = router;