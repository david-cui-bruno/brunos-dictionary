import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import type { Word, Definition } from '../../types/index';
import { Link } from 'react-router-dom';
import { voteOnDefinition } from '../../firebase/dictionary';
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

const MostPopularEntries: React.FC = () => {
  const [definitions, setDefinitions] = useState<DefinitionWithWord[]>([]);
  const [userVotes, setUserVotes] = useState<{ [definitionId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPopularDefinitions = async () => {
      const defsRef = collection(db, 'definitions');
      const defsQuery = query(defsRef, orderBy('score', 'desc'));
      const defsSnapshot = await getDocs(defsQuery);
      const defs = defsSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Definition[];

      let defsWithWord: DefinitionWithWord[] = [];
      for (const def of defs) {
        let wordTerm = 'Unknown';
        try {
          const wordDoc = await getDoc(doc(db, 'words', def.wordId));
          if (wordDoc.exists()) {
            wordTerm = (wordDoc.data() as Word).term;
          }
        } catch (e) {
          // keep wordTerm as 'Unknown'
        }
        defsWithWord.push({
          ...def,
          wordTerm,
          wordId: def.wordId
        });
      }
      setDefinitions(defsWithWord);
      setLoading(false);

      // Fetch user votes after definitions are loaded
      if (isAuthenticated && currentUser) {
        const definitionIds = defsWithWord.map(def => def.id!);
        fetchUserVotes(currentUser.uid, definitionIds).then(setUserVotes);
      }
    };

    fetchPopularDefinitions();
    // eslint-disable-next-line
  }, [isAuthenticated, currentUser]);

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

  if (loading) {
    return <div className="text-center py-8">Loading popular entries...</div>;
  }

  return (
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
              <Link to={`/search?q=${encodeURIComponent(def.wordTerm)}`} className="hover:underline">
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
  );
};

export default MostPopularEntries;
