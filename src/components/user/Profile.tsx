import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Word, Definition } from '../../types/index';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [userDefinitions, setUserDefinitions] = useState<(Definition & { wordTerm: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserContent = async () => {
      if (!isAuthenticated || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user's words
        const wordsQuery = query(
          collection(db, 'words'), 
          where('authorId', '==', currentUser.uid)
        );
        const wordsSnapshot = await getDocs(wordsQuery);
        const words = wordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Word[];
        setUserWords(words);
        
        // Fetch user's definitions
        const defsQuery = query(
          collection(db, 'definitions'),
          where('authorId', '==', currentUser.uid)
        );
        const defsSnapshot = await getDocs(defsQuery);
        
        // For each definition, get the word term
        const defsWithWords = await Promise.all(
          defsSnapshot.docs.map(async (defDoc) => {
            const def = { id: defDoc.id, ...defDoc.data() } as Definition;
            const wordDoc = await getDoc(doc(db, 'words', def.wordId));
            const wordTerm = wordDoc.exists() ? wordDoc.data().term : 'Unknown';
            return { ...def, wordTerm };
          })
        );
        
        setUserDefinitions(defsWithWords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserContent();
  }, [currentUser, isAuthenticated]);
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p>Please log in to view your profile</p>
          <div className="mt-4">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-2">
              Log In
            </Link>
            <Link to="/signup" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading profile...</div>;
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
      <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-2">Account Information</h3>
        <div className="mb-2">
          <span className="font-semibold">Display Name: </span>
          {currentUser?.displayName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email: </span>
          {currentUser?.email}
        </div>
        <div>
          <span className="font-semibold">Account Created: </span>
          {currentUser?.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Unknown'}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Your Words ({userWords.length})</h3>
        
        {userWords.length === 0 ? (
          <p className="text-gray-600">You haven't added any words yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userWords.map(word => (
              <Link 
                key={word.id} 
                to={`/word/${word.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="text-lg font-bold text-blue-600">{word.term}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  Added on {new Date(word.createdAt.toDate()).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Definitions ({userDefinitions.length})</h3>
        
        {userDefinitions.length === 0 ? (
          <p className="text-gray-600">You haven't added any definitions yet.</p>
        ) : (
          <div className="space-y-4">
            {userDefinitions.map(def => (
              <Link 
                key={def.id} 
                to={`/word/${def.wordId}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <h4 className="text-lg font-bold text-blue-600">{def.wordTerm}</h4>
                <p className="text-gray-800 mt-2">{def.text}</p>
                <div className="bg-gray-100 p-2 rounded italic text-sm mt-2">"{def.example}"</div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="mr-4">Score: {def.score}</span>
                  <span>Added on {new Date(def.createdAt.toDate()).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
