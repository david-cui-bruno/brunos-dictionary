import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addWord } from '../../firebase/dictionary';

const WordForm: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!isAuthenticated || !currentUser) {
      setError('You must be logged in to submit a word');
      setLoading(false);
      return;
    }
    
    try {
      // Add the word first
      const wordRef = await addWord(
        currentUser, 
        term, 
        category, 
        tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      );
      
      // Then add the definition for this word
      const { addDefinition } = await import('../../firebase/dictionary');
      await addDefinition(currentUser, wordRef.id, definition, example);
      
      setSuccess(true);
      setTerm('');
      setDefinition('');
      setExample('');
      setCategory('');
      setTags('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Submit a New Word</h2>
        <p className="text-red-600">You must be logged in to submit a word.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit a New Word</h2>
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Your submission has been added successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="term">
            Term or Phrase
          </label>
          <input
            id="term"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="definition">
            Definition
          </label>
          <textarea
            id="definition"
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="example">
            Example Usage
          </label>
          <textarea
            id="example"
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category (optional)
          </label>
          <input
            id="category"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Slang, Academic, etc."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="tags">
            Tags (comma separated, optional)
          </label>
          <input
            id="tags"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="college, funny, brown"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Word'}
        </button>
      </form>
    </div>
  );
};

export default WordForm;
