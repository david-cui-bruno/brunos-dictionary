import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './components/home/HomePage';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import WordDetail from './components/dictionary/WordDetail';
import Search from './components/dictionary/Search';
import Profile from './components/user/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/word/:wordId" element={<WordDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4">Bruno's Dictionary</h3>
                <p className="text-gray-400">
                  The community-driven dictionary for college slang and academic terms.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/search" className="text-gray-400 hover:text-white">Search</Link></li>
                  <li><Link to="/submit" className="text-gray-400 hover:text-white">Add Word</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">About</h3>
                <p className="text-gray-400">
                  Only .edu email addresses may register and contribute to preserve authenticity.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Bruno's Dictionary. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
