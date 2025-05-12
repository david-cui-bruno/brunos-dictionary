import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getDefinitionsForWord } from '../../firebase/dictionary';
import type { Word, Definition } from '../../types/index';

interface DefinitionWithWord extends Definition {
  wordTerm: string;
}

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [definitions, setDefinitions] = useState<DefinitionWithWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    // eslint-disable-next-line
  }, [initialQuery]);

  const performSearch = async (term: string) => {
    setLoading(true);
    setError('');
    setDefinitions([]);
    try {
      const wordsRef = collection(db, 'words');
      const searchTermLower = term.toLowerCase();
      const q = query(
        wordsRef,
        orderBy('term'),
        startAt(searchTermLower),
        endAt(searchTermLower + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      const words = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Word[];

      // Fetch all definitions for all found words
      let allDefs: DefinitionWithWord[] = [];
      for (const word of words) {
        const defs = await getDefinitionsForWord(word.id!);
        // Attach the word's term to each definition
        allDefs = allDefs.concat(defs.map(def => ({
          ...def,
          wordTerm: word.term
        })));
      }

      // Sort by score (upvotes)
      allDefs.sort((a, b) => (b.score || 0) - (a.score || 0));
      setDefinitions(allDefs);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
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

      {/* Only show the cards */}
      <div>
        {definitions.length > 0 ? (
          <div className="space-y-6">
            {definitions.map(def => (
              <div key={def.id} className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-2xl font-bold text-blue-600 mb-2">{def.wordTerm}</h4>
                <p className="text-lg">{def.text}</p>
                <p className="italic text-gray-600 mt-2">{def.example}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Defined by {def.authorName} on {def.createdAt && typeof def.createdAt.toDate === 'function'
                    ? new Date(def.createdAt.toDate()).toLocaleDateString()
                    : ''}
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="border border-black rounded-full px-3 py-1">▲ {def.upvotes}</span>
                  <span className="border border-black rounded-full px-3 py-1">▼ {def.downvotes}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-8">
              <p className="mb-4">No definitions found.</p>
              <Link 
                to="/submit" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Add It to the Dictionary
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
