import React from 'react';

interface VoteBoxProps {
  score: number;
  userVote: 1 | -1 | 0 | undefined;
  onUpvote: () => void;
  onDownvote: () => void;
  disabled: boolean;
}

const VoteBox: React.FC<VoteBoxProps> = ({ score, userVote, onUpvote, onDownvote, disabled }) => (
  <div
    className={`flex items-center border border-black rounded-full transition-colors
      ${
        userVote === 1
          ? 'bg-green-200'
          : userVote === -1
          ? 'bg-red-200'
          : 'bg-white'
      }`}
  >
    <button
      onClick={onUpvote}
      disabled={disabled || userVote === 1}
      className={`px-3 py-1 rounded-l-full focus:outline-none transition-colors bg-white text-green-600`}
      aria-label="Upvote"
    >
      ▲
    </button>
    <span className="px-4 font-bold text-black select-none">{score}</span>
    <button
      onClick={onDownvote}
      disabled={disabled || userVote === -1}
      className={`px-3 py-1 rounded-r-full focus:outline-none transition-colors bg-white text-red-600`}
      aria-label="Downvote"
    >
      ▼
    </button>
  </div>
);

export default VoteBox;
