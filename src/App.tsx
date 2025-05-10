import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './components/home/HomePage';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import WordDetail from './components/dictionary/WordDetail';
import Search from './components/dictionary/Search';
import Profile from './components/user/Profile';
import WordForm from './components/dictionary/WordForm';

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
        <footer className="bg-gray-800 text-white p-6 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <p>© {new Date().getFullYear()} Bruno's Dictionary. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Only .edu email addresses may register.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
