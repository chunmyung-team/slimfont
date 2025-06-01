import React from 'react';

interface TextInputProps {
  inputText: string;
  onTextChange: (text: string) => void;
  getUniqueCharacters: (text: string) => string[];
}

export const TextInput: React.FC<TextInputProps> = ({inputText, onTextChange, getUniqueCharacters}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Input characters to include</h2>
      <textarea
        value={inputText}
        onChange={e => onTextChange(e.target.value)}
        placeholder="Input characters you want to include. e.g. 안녕하세요 123"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <div className="mt-2 text-sm text-gray-500">
        Number of characters to save: {getUniqueCharacters(inputText).length}
      </div>
    </div>
  );
};
