import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';
import logoImage from '../../assets/logo.png';

const navLinks = [
  { to: '/search', label: 'Browse' },
  { to: '/submit', label: 'Add Word' },
];

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
    <header className="sticky top-0 z-50 w-full bg-brown text-white shadow-md">
      {/* Top Row: Logo and Nav Links */}
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row items-center justify-start w-full py-4 pl-30 space-x-12">
          {/* Logo as Home Link */}
          <Link to="/">
            <img
              src={logoImage}
              alt="Bruno's Dictionary"
              className="h-12 w-auto"
              style={{ minWidth: 48 }}
            />
          </Link>
          {/* Nav Links */}
          <nav className="flex flex-row items-center space-x-12">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="font-['Helvetica'] text-[12pt] text-white hover:text-brown-light transition"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="font-['Helvetica'] text-[12pt] text-white hover:text-brown-light transition"
                >
                  {currentUser?.displayName || 'Profile'}
                </Link>
                <button
                  onClick={() => logOut()}
                  className="font-['Helvetica'] text-[12pt] text-white hover:text-brown-light transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-['Helvetica'] text-[12pt] text-white hover:text-brown-light transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="font-['Helvetica'] text-[12pt] text-white hover:text-brown-light transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
        {/* Search Bar Row */}
        <div className="w-full flex justify-center pb-4">
          <form
            onSubmit={handleSearch}
            className="w-[60%] flex"
          >
            <input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-black placeholder-black px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brown-dark font-['Helvetica'] text-[12pt]"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 rounded-full bg-brown-dark text-white font-['Helvetica'] text-[12pt] hover:bg-brown-light transition"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
