import React from 'react';
import { Link } from 'react-router-dom';
import WordList from '../dictionary/WordList';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="bg-[#1c2331] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">Bruno's</span>
              <span className="text-yellow-400"> Dictionary</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">The college slang dictionary for .edu users</p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/search" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Browse Dictionary
              </Link>
              <Link 
                to="/submit" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
              >
                Add a Word
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="page-container py-12">
        <h2 className="section-title">Latest Dictionary Entries</h2>
        <WordList />
        
        <div className="text-center mt-12">
          <Link 
            to="/search" 
            className="btn-primary inline-block"
          >
            View More Words
          </Link>
        </div>
      </div>
      
      <div className="bg-indigo-50 py-12">
        <div className="page-container">
          <h2 className="section-title">About Bruno's Dictionary</h2>
          <div className="prose lg:prose-xl max-w-3xl mx-auto">
            <p>
              Bruno's Dictionary is a community-driven collection of college slang, academic terms, and campus lingo. 
              All content is contributed by .edu email holders, ensuring authentic campus culture.
            </p>
            <p>
              Join our growing community of contributors and help document the evolving language of university life!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
