import { db } from './config';
import { 
  collection, addDoc, getDocs, doc, getDoc, 
  query, where, orderBy, updateDoc, increment,
  serverTimestamp, Timestamp, deleteDoc, limit
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Word, Definition, Vote } from '../types';

// Words
export const addWord = async (currentUser: User, term: string, category?: string, tags?: string[]) => {
  return await addDoc(collection(db, 'words'), {
    term: term.toLowerCase(),
    createdAt: serverTimestamp(),
    authorId: currentUser.uid,
    authorName: currentUser.displayName || 'Anonymous',
    isApproved: true,
    category,
    tags
  });
};

export const getWords = async (limitCount = 20) => {
  const wordsRef = collection(db, 'words');
  const q = query(wordsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Word[];
};

export const searchWords = async (searchTerm: string) => {
  // Basic search - in production you might want Firebase Extensions or Algolia
  const wordsRef = collection(db, 'words');
  const q = query(
    wordsRef, 
    where('term', '>=', searchTerm.toLowerCase()), 
    where('term', '<=', searchTerm.toLowerCase() + '\uf8ff')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Definitions
export const addDefinition = async (
  currentUser: User, 
  wordId: string, 
  text: string, 
  example: string
) => {
  return await addDoc(collection(db, 'definitions'), {
    wordId,
    text,
    example,
    createdAt: serverTimestamp(),
    authorId: currentUser.uid,
    authorName: currentUser.displayName || 'Anonymous',
    upvotes: 0,
    downvotes: 0,
    score: 0,
    isApproved: true
  });
};

export const getDefinitionsForWord = async (wordId: string) => {
  const defsRef = collection(db, 'definitions');
  const q = query(
    defsRef, 
    where('wordId', '==', wordId),
    orderBy('score', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Definition[];
};

// Voting
export const voteOnDefinition = async (
  currentUser: User,
  definitionId: string,
  voteValue: 1 | -1
) => {
  // Check if user already voted
  const votesRef = collection(db, 'votes');
  const q = query(
    votesRef,
    where('definitionId', '==', definitionId),
    where('userId', '==', currentUser.uid)
  );
  
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const existingVote = snapshot.docs[0];
    const existingVoteData = existingVote.data();
    
    if (existingVoteData.value === voteValue) {
      // Remove vote if clicking the same button
      await updateDoc(doc(db, 'definitions', definitionId), {
        [`${voteValue === 1 ? 'upvotes' : 'downvotes'}`]: increment(-1),
        score: increment(-voteValue)
      });
      
      await deleteDoc(doc(db, 'votes', existingVote.id));
      return;
    }
    
    // Change vote
    await updateDoc(doc(db, 'votes', existingVote.id), {
      value: voteValue
    });
    
    await updateDoc(doc(db, 'definitions', definitionId), {
      upvotes: increment(voteValue === 1 ? 1 : -1),
      downvotes: increment(voteValue === -1 ? 1 : -1),
      score: increment(voteValue * 2)
    });
    
    return;
  }
  
  // New vote
  await addDoc(collection(db, 'votes'), {
    definitionId,
    userId: currentUser.uid,
    value: voteValue,
    createdAt: serverTimestamp()
  });
  
  await updateDoc(doc(db, 'definitions', definitionId), {
    [`${voteValue === 1 ? 'upvotes' : 'downvotes'}`]: increment(1),
    score: increment(voteValue)
  });
};
