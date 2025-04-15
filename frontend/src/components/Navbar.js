import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Task Manager
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/tasks" className="text-white hover:text-blue-200">
                Minhas Tarefas
              </Link>
              <button
                onClick={() => logout()}
                className="text-white hover:text-blue-200"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-blue-200">
                Cadastro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;