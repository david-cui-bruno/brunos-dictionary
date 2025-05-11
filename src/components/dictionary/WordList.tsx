import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWords } from '../../firebase/dictionary';
import type { Word } from '../../types/index';

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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        Error: {error}
      </div>
    );
  }
  
  return (
    <div>
      {words.length === 0 ? (
        <div className="text-center text-gray-600 py-12">No words have been added yet. Be the first!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => (
            <Link 
              key={word.id} 
              to={`/word/${word.id}`}
              className="card hover:translate-y-[-4px]"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">{word.term}</h3>
                {word.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    {word.category}
                  </span>
                )}
                {word.tags && word.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
                <div className="text-sm text-gray-500 mt-3 flex items-center">
                  <span className="mr-1">👤</span>
                  {word.authorName} • {new Date(word.createdAt.toDate()).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordList;
