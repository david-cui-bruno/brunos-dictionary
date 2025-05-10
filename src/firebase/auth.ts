import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const signUp = async (email: string, password: string, displayName: string) => {
  // Validate .edu email
  if (!email.toLowerCase().endsWith('.edu')) {
    throw new Error('Only .edu email addresses are allowed to register');
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        createdAt: new Date(),
        domain: email.split('@')[1]
      });
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = () => signOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

export const onAuthChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
