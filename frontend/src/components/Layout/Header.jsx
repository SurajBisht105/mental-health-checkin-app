import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Mental Health Check-in
          </Link>
          
          {user && (
            <nav className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Check-in
              </Link>
              <Link 
                to="/history" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                History
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;