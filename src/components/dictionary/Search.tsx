import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, orderBy, startAt, endAt, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getDefinitionsForWord, voteOnDefinition } from '../../firebase/dictionary';
import type { Word, Definition } from '../../types/index';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import VoteBox from './VoteBox';

interface DefinitionWithWord extends Definition {
  wordTerm: string;
  wordId: string;
}

const fetchUserVotes = async (userId: string, definitionIds: string[]) => {
  if (definitionIds.length === 0) return {};
  // Firestore 'in' queries are limited to 10 items at a time
  const batches = [];
  for (let i = 0; i < definitionIds.length; i += 10) {
    batches.push(definitionIds.slice(i, i + 10));
  }
  let votes: { [definitionId: string]: number } = {};
  for (const batch of batches) {
    const votesRef = collection(db, 'votes');
    const q = query(votesRef, where('userId', '==', userId), where('definitionId', 'in', batch));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const data = doc.data();
      votes[data.definitionId] = data.value;
    });
  }
  return votes;
};

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [definitions, setDefinitions] = useState<DefinitionWithWord[]>([]);
  const [userVotes, setUserVotes] = useState<{ [definitionId: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, isAuthenticated } = useAuth();

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
        allDefs = allDefs.concat(defs.map(def => ({
          ...def,
          wordTerm: word.term,
          wordId: word.id!
        })));
      }

      // Sort by score (upvotes)
      allDefs.sort((a, b) => (b.score || 0) - (a.score || 0));
      setDefinitions(allDefs);

      // Fetch user votes after definitions are loaded
      if (isAuthenticated && currentUser) {
        const definitionIds = allDefs.map(def => def.id!);
        fetchUserVotes(currentUser.uid, definitionIds).then(setUserVotes);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (definitionId: string, value: 1 | -1) => {
    if (!isAuthenticated || !currentUser) {
      alert('You must be logged in to vote');
      return;
    }
    if (userVotes[definitionId] === value) {
      // Already voted this way, do nothing
      return;
    }
    await voteOnDefinition(currentUser, definitionId, value);

    // Optimistically update UI
    setUserVotes(votes => ({ ...votes, [definitionId]: value }));
    setDefinitions(defs =>
      defs.map(def =>
        def.id === definitionId
          ? {
              ...def,
              score: (def.score || 0) + (value - (userVotes[definitionId] || 0)),
              upvotes: value === 1
                ? def.upvotes + (userVotes[definitionId] === -1 ? 1 : userVotes[definitionId] === 1 ? 0 : 1)
                : def.upvotes - (userVotes[definitionId] === 1 ? 1 : 0),
              downvotes: value === -1
                ? def.downvotes + (userVotes[definitionId] === 1 ? 1 : userVotes[definitionId] === -1 ? 0 : 1)
                : def.downvotes - (userVotes[definitionId] === -1 ? 1 : 0)
            }
          : def
      )
    );
    // Immediately re-sort, triggering the animation
    setDefinitions(defs =>
      [...defs].sort((a, b) => (b.score || 0) - (a.score || 0))
    );
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
            <AnimatePresence>
              {definitions.map(def => (
                <motion.div
                  key={def.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h4 className="text-2xl font-bold text-blue-600 mb-2">
                    <Link to={`/word/${def.wordId}`} className="hover:underline">
                      {def.wordTerm}
                    </Link>
                  </h4>
                  <p className="text-lg">{def.text}</p>
                  <p className="italic text-gray-600 mt-2">{def.example}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    Defined by {def.authorName} on {def.createdAt && typeof def.createdAt.toDate === 'function'
                      ? new Date(def.createdAt.toDate()).toLocaleDateString()
                      : ''}
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <VoteBox
                      score={def.score}
                      userVote={
                        userVotes[def.id!] === 1
                          ? 1
                          : userVotes[def.id!] === -1
                          ? -1
                          : userVotes[def.id!] === 0
                          ? 0
                          : undefined
                      }
                      onUpvote={() => handleVote(def.id!, 1)}
                      onDownvote={() => handleVote(def.id!, -1)}
                      disabled={!isAuthenticated}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
