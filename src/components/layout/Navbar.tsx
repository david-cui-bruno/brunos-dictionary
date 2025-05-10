import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Bruno's Dictionary</Link>
        
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/search" className="hover:text-blue-200">Search</Link>
          <Link to="/submit" className="hover:text-blue-200">Add Word</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-blue-200">
                {currentUser?.displayName || 'Profile'}
              </Link>
              <button 
                onClick={() => logOut()}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Log In</Link>
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
