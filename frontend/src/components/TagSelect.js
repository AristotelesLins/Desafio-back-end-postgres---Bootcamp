import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TagSelect = ({ selectedTagId, onTagChange, onNewTag }) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#FF0000');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Erro ao carregar tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    if (!newTagName) return;
    try {
      const response = await api.post('/tags', {
        name: newTagName,
        color: newTagColor,
      });
      setTags([...tags, response.data]);
      setNewTagName('');
      setNewTagColor('#FF0000');
      onNewTag(response.data);
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Selecionar Tag
        </label>
        <select
          value={selectedTagId || ''}
          onChange={(e) => onTagChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="">Selecione uma tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Criar Nova Tag
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nome da tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <input
            type="color"
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
            className="w-10 h-10"
          />
          <button
            onClick={handleCreateTag}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagSelect;