import React from 'react';
import { Link } from 'react-router-dom';
import WordList from '../dictionary/WordList';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24 px-4">
      {/* Subtitle */}
      <h2 className="font-['Helvetica'] text-[12pt] text-brown mb-6 text-center font-semibold">
        The college slang dictionary for .edu users
      </h2>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <Link
          to="/search"
          className="bg-brown text-white font-['Helvetica'] text-[12pt] font-bold py-3 px-8 rounded-full shadow hover:bg-brown-dark transition"
        >
          Browse Dictionary
        </Link>
        <Link
          to="/submit"
          className="bg-brown-light text-brown-dark font-['Helvetica'] text-[12pt] font-bold py-3 px-8 rounded-full shadow hover:bg-brown transition"
        >
          Add a Word
        </Link>
      </div>

      {/* About Section */}
      <div className="max-w-2xl mt-12 bg-brown-light bg-opacity-80 rounded-xl p-6 text-brown-dark text-center shadow font-['Helvetica'] text-[12pt]">
        <h3 className="text-lg font-semibold mb-2">What is Bruno's Dictionary?</h3>
        <p>
          Bruno's Dictionary is a community-driven collection of college slang, academic terms, and campus lingo.
          All content is contributed by .edu email holders, ensuring authentic campus culture.
        </p>
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
