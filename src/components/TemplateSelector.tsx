import React from 'react';
import {
  PRIMARY_HANGUL,
  BASE_HANGUL,
  BASE_NUMBER,
  ALPHABET_UPPER,
  ALPHABET_LOWER,
  PUNCTUATION,
} from '../subset-template';

interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void;
}

interface Template {
  name: string;
  content: string;
  preview: string;
}

const templates: Template[] = [
  {
    name: 'Primary Hangul',
    content: PRIMARY_HANGUL,
    preview: '가나다라마바사아자차카타파하...',
  },
  {
    name: 'Base Hangul',
    content: BASE_HANGUL,
    preview: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ',
  },
  {
    name: 'Numbers',
    content: BASE_NUMBER,
    preview: '0123456789',
  },
  {
    name: 'Uppercase Alphabet',
    content: ALPHABET_UPPER,
    preview: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  {
    name: 'Lowercase Alphabet',
    content: ALPHABET_LOWER,
    preview: 'abcdefghijklmnopqrstuvwxyz',
  },
  {
    name: 'Punctuation',
    content: PUNCTUATION,
    preview: '!"#$%&()*+,-./:;<=>?@[\\]_`|~',
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({onTemplateSelect}) => {
  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template.content);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Template Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map(template => (
          <button
            key={template.name}
            onClick={() => handleTemplateClick(template)}
            className="cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="font-medium text-gray-800 mb-1">{template.name}</div>
            <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded overflow-hidden">
              {template.preview.length > 30 ? `${template.preview.substring(0, 30)}...` : template.preview}
            </div>
            <div className="text-xs text-blue-600 mt-1">{template.content.length} characters</div>
          </button>
        ))}
      </div>
    </div>
  );
};
