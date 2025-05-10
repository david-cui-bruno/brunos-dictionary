import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addDefinition } from '../../firebase/dictionary';
import { Definition } from '../../types/index';

interface DefinitionFormProps {
  wordId: string;
  onDefinitionAdded: (definition: Definition) => void;
}

const DefinitionForm: React.FC<DefinitionFormProps> = ({ wordId, onDefinitionAdded }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!currentUser) {
      setError('You must be logged in to add a definition');
      setLoading(false);
      return;
    }
    
    try {
      const definitionRef = await addDefinition(currentUser, wordId, text, example);
      
      // Get the added definition
      const { getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../../firebase/config');
      
      const definitionDoc = await getDoc(doc(db, 'definitions', definitionRef.id));
      const newDefinition = { id: definitionDoc.id, ...definitionDoc.data() } as Definition;
      
      // Pass it to the parent component
      onDefinitionAdded(newDefinition);
      
      // Reset form
      setText('');
      setExample('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="definition">
          Definition
        </label>
        <textarea
          id="definition"
          className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
          placeholder="Example of the word used in a sentence"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Definition'}
      </button>
    </form>
  );
};

export default DefinitionForm;
