import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Word } from '../../types/index';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const performSearch = async (term: string) => {
    setLoading(true);
    setError('');
    
    try {
      const wordsRef = collection(db, 'words');
      // Basic prefix search
      const searchTermLower = term.toLowerCase();
      const q = query(
        wordsRef,
        orderBy('term'),
        startAt(searchTermLower),
        endAt(searchTermLower + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Word[];
      
      setResults(searchResults);
      setHasSearched(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm });
      performSearch(searchTerm);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Search Dictionary</h2>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a word or phrase..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md"
          >
            Search
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {hasSearched && !loading && !error && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            {results.length === 0 
              ? 'No results found' 
              : `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
          </h3>
          
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(word => (
                <Link 
                  key={word.id} 
                  to={`/word/${word.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <h4 className="text-lg font-bold text-blue-600">{word.term}</h4>
                  {word.category && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2">
                      {word.category}
                    </span>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    Added by {word.authorName} on {new Date(word.createdAt.toDate()).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {results.length === 0 && (
            <div className="text-center py-8">
              <p className="mb-4">Don't see what you're looking for?</p>
              <Link 
                to="/submit" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Add It to the Dictionary
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
