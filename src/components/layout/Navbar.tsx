import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';
import logoImage from '../../assets/logo.png';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-[#1c2331] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="Bruno's Dictionary" className="h-10 md:h-12" />
          </Link>
          
          {/* Main Navigation */}
          <nav className="flex items-center space-x-6">
            <div className="dropdown relative group">
              <button className="flex items-center font-semibold">
                Browse
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="dropdown-menu absolute hidden bg-[#1c2331] rounded shadow-lg p-2 mt-2 z-10 min-w-[150px] group-hover:block">
                <Link to="/search" className="block p-2 hover:bg-[#2c3341]">All Words</Link>
                <Link to="/search?q=a" className="block p-2 hover:bg-[#2c3341]">Trending</Link>
                <Link to="/search" className="block p-2 hover:bg-[#2c3341]">Recent</Link>
              </div>
            </div>
            
            <Link to="/submit" className="font-semibold">Add Word</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center">
                  <span className="mr-1">👤</span>
                  {currentUser?.displayName || 'Profile'}
                </Link>
                <button 
                  onClick={() => logOut()}
                  className="text-white"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="font-semibold">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Search Bar - Urban Dictionary Style */}
        <div className="mt-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0e17] text-white py-2 px-4 pr-10 rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button type="button" className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
