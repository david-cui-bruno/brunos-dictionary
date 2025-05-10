import React from 'react';
import { Link } from 'react-router-dom';
import WordList from '../dictionary/WordList';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="bg-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Bruno's Dictionary</h1>
          <p className="text-xl mb-6">The ultimate dictionary for college slang and academic terms</p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/search" 
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-2 px-6 rounded-md"
            >
              Search Dictionary
            </Link>
            <Link 
              to="/submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md border border-white"
            >
              Add a Word
            </Link>
          </div>
        </div>
      </div>
      
      <div className="py-8">
        <WordList />
        
        <div className="max-w-4xl mx-auto px-6 text-center mt-8">
          <Link 
            to="/search" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            View More Words
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
