import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWords } from '../../firebase/dictionary';
import { Word } from '../../types';

const WordList: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const fetchedWords = await getWords(50);
        setWords(fetchedWords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWords();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading words...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          Error: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Latest Dictionary Entries</h2>
      
      {words.length === 0 ? (
        <div className="text-gray-600">No words have been added yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {words.map((word) => (
            <Link 
              key={word.id} 
              to={`/word/${word.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h3 className="text-xl font-bold text-blue-600">{word.term}</h3>
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
    </div>
  );
};

export default WordList;
