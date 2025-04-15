import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TagSelect from '../components/TagSelect';
import { Dialog } from '@headlessui/react';

const Tasks = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTagId, setSelectedTagId] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const fetchTasks = async (tagFilter = '') => {
    try {
      const endpoint = tagFilter ? `/tasks/filter?tags=${tagFilter}` : '/tasks';
      const response = await api.get(endpoint);
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, data);
      } else {
        await api.post('/tasks', data);
      }
      fetchTasks();
      reset();
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('status', task.status);
    setValue('priority', task.priority);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }
  };

  const handleManageTags = (task) => {
    setCurrentTask(task);
    setIsTagModalOpen(true);
  };

  const handleAddTag = async () => {
    if (!selectedTagId) return;
    try {
      await api.post(`/tasks/${currentTask.id}/tags`, { tagId: selectedTagId });
      setSelectedTagId('');
      fetchTasks();
    } catch (error) {
      console.error('Erro ao associar tag:', error);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      await api.delete(`/tasks/${currentTask.id}/tags/${tagId}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao desassociar tag:', error);
    }
  };

  const handleFilterByTag = (tagName) => {
    setFilterTag(tagName);
    fetchTasks(tagName);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>

      {/* Botão para criar nova tarefa */}
      <button
        onClick={() => {
          reset();
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Criar Nova Tarefa
      </button>

      {/* Filtro por tags */}
      <div className="mb-4">
        <TagSelect
          selectedTagId={filterTag}
          onTagChange={(tagName) => handleFilterByTag(tagName)}
          onNewTag={() => {}}
        />
      </div>

      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageTags={handleManageTags}
          />
        ))
      )}

      {/* Modal para criar/editar tarefa */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              {editingTask ? 'Editar Tarefa' : 'Criar Tarefa'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  {...register('title', { required: 'Título é obrigatório' })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  {...register('description', { required: 'Descrição é obrigatória' })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register('status', { required: 'Status é obrigatório' })}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <input
                  type="number"
                  {...register('priority', {
                    required: 'Prioridade é obrigatória',
                    min: { value: 1, message: 'Prioridade deve ser pelo menos 1' },
                    max: { value: 5, message: 'Prioridade deve ser no máximo 5' }
                  })}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingTask ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal para gerenciar tags */}
      <Dialog open={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              Gerenciar Tags - {currentTask?.title}
            </Dialog.Title>
            <TagSelect
              selectedTagId={selectedTagId}
              onTagChange={setSelectedTagId}
              onNewTag={(newTag) => setSelectedTagId(newTag.id)}
            />
            <button
              onClick={handleAddTag}
              className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Adicionar Tag
            </button>
            {currentTask?.Tags?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Tags Associadas</h3>
                {currentTask.Tags.map((tag) => (
                  <div key={tag.id} className="flex justify-between items-center mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {tag.name}
                    </span>
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setIsTagModalOpen(false)}
              className="mt-4 w-full py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            >
              Fechar
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Tasks;