import React from 'react';
import {TemplateSelector} from './TemplateSelector';

interface TextInputProps {
  inputText: string;
  onTextChange: (text: string) => void;
  getUniqueCharacters: (text: string) => string[];
}

export const TextInput: React.FC<TextInputProps> = ({inputText, onTextChange, getUniqueCharacters}) => {
  const handleTemplateSelect = (templateContent: string) => {
    // 기존 텍스트에 템플릿 내용을 추가 (중복 제거는 getUniqueCharacters에서 처리됨)
    const newText = inputText + templateContent;
    onTextChange(newText);
  };

  const handleClearText = () => {
    onTextChange('');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Input characters to include</h2>

      <TemplateSelector onTemplateSelect={handleTemplateSelect} />

      <div className="relative">
        <textarea
          value={inputText}
          onChange={e => onTextChange(e.target.value)}
          placeholder="Input characters you want to include. e.g. 안녕하세요 123"
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {inputText && (
          <button
            onClick={handleClearText}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear all text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-2 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Number of characters to save: {getUniqueCharacters(inputText).length}
        </div>
        <div className="text-xs text-gray-400">Total input length: {inputText.length}</div>
      </div>
    </div>
  );
};
