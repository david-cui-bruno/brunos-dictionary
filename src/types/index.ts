import { Timestamp } from 'firebase/firestore';

export interface Word {
  id?: string;
  term: string;
  createdAt: Timestamp;
  authorId: string;
  authorName: string;
  isApproved: boolean;
  category?: string;
  tags?: string[];
}

export interface Definition {
  id?: string;
  wordId: string;
  text: string;
  example: string;
  createdAt: Timestamp;
  authorId: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  score: number;
  isApproved: boolean;
}

export interface Vote {
  id?: string;
  definitionId: string;
  userId: string;
  value: number;
  createdAt: Timestamp;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  domain: string;
  reputation?: number;
}
