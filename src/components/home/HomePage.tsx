import React from 'react';
import { Link } from 'react-router-dom';
import MostPopularEntries from '../dictionary/MostPopularEntries.tsx';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-12 px-4">
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
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

      <div className="page-container py-8">
        <h2 className="section-title">Most Popular Dictionary Entries</h2>
        <MostPopularEntries />
      </div>
    </div>
  );
};

export default HomePage;
