import { db } from './config';
import { 
  collection, addDoc, getDocs, getDoc, doc, 
  query, orderBy, updateDoc,
  increment, serverTimestamp
} from 'firebase/firestore';

// Example functions for your dictionary
export const addWord = async (wordData: any) => {
  return await addDoc(collection(db, 'words'), {
    ...wordData,
    createdAt: serverTimestamp(),
    votes: 0
  });
};

export const getWords = async () => {
  const wordsRef = collection(db, 'words');
  const q = query(wordsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getWordById = async (id: string) => {
  const docRef = doc(db, 'words', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const upvoteWord = async (id: string) => {
  const wordRef = doc(db, 'words', id);
  return await updateDoc(wordRef, {
    votes: increment(1)
  });
};