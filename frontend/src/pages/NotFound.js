import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Página Não Encontrada</h1>
      <p className="text-gray-600 mb-4">A página que você está procurando não existe.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFound;