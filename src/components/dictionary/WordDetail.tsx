import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getDefinitionsForWord, voteOnDefinition } from '../../firebase/dictionary';
import type { Word, Definition } from '../../types/index';
import { useAuth } from '../../context/AuthContext';
import DefinitionForm from './DefinitionForm';

const WordDetail: React.FC = () => {
  // Fix the params typing
  const { wordId } = useParams<{ wordId: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const [word, setWord] = useState<Word | null>(null);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchWordAndDefinitions = async () => {
      if (!wordId) return;
      
      try {
        // Fetch word details
        const wordDoc = await getDoc(doc(db, 'words', wordId));
        if (!wordDoc.exists()) {
          setError('Word not found');
          setLoading(false);
          return;
        }
        
        setWord({ id: wordDoc.id, ...wordDoc.data() } as Word);
        
        // Fetch definitions
        const defs = await getDefinitionsForWord(wordId);
        setDefinitions(defs);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWordAndDefinitions();
  }, [wordId]);
  
  const handleVote = async (definitionId: string, value: 1 | -1) => {
    if (!isAuthenticated || !currentUser) {
      setError('You must be logged in to vote');
      return;
    }
    
    try {
      await voteOnDefinition(currentUser, definitionId, value);
      
      // Refresh definitions to get updated counts
      if (wordId) {
        const defs = await getDefinitionsForWord(wordId);
        setDefinitions(defs);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
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
  
  if (!word) {
    return <div className="max-w-4xl mx-auto p-6">Word not found</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-2 text-[#1c2331]">{word.term}</h1>
        
        {word.category && (
          <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2">
            {word.category}
          </span>
        )}
        
        {word.tags && word.tags.map(tag => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {tag}
          </span>
        ))}
        
        <div className="text-sm text-gray-500 mt-4">
          Added by {word.authorName} on {new Date(word.createdAt.toDate()).toLocaleDateString()}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Definitions</h2>
        
        {definitions.length === 0 ? (
          <div className="text-gray-600">No definitions yet. Be the first to add one!</div>
        ) : (
          <div className="space-y-6">
            {definitions.map((def) => (
              <div key={def.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <button 
                      onClick={() => handleVote(def.id!, 1)}
                      className="text-gray-500 hover:text-green-500 focus:outline-none p-1"
                      disabled={!isAuthenticated}
                    >
                      ▲
                    </button>
                    <span className="my-1 font-bold">{def.score}</span>
                    <button 
                      onClick={() => handleVote(def.id!, -1)}
                      className="text-gray-500 hover:text-red-500 focus:outline-none p-1"
                      disabled={!isAuthenticated}
                    >
                      ▼
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-lg mb-2">{def.text}</p>
                    <div className="bg-gray-100 p-3 rounded italic">"{def.example}"</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Defined by {def.authorName} on {new Date(def.createdAt.toDate()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isAuthenticated ? (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Add Your Definition</h3>
          <DefinitionForm wordId={wordId!} onDefinitionAdded={(newDef) => setDefinitions([...definitions, newDef])} />
        </div>
      ) : (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <p>Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to add your own definition or vote on others.</p>
        </div>
      )}
    </div>
  );
};

export default WordDetail;
