import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const TaskCard = ({ task, onEdit, onDelete, onManageTags }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500">Status: {task.status}</p>
      <p className="text-sm text-gray-500">Prioridade: {task.priority}</p>
      {task.Tags && task.Tags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Tags:</p>
          <div className="flex space-x-2">
            {task.Tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <PencilIcon className="h-5 w-5 mr-1" />
          Editar
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          Deletar
        </button>
        <button
          onClick={() => onManageTags(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Gerenciar Tags
        </button>
      </div>
    </div>
  );
};

export default TaskCard;