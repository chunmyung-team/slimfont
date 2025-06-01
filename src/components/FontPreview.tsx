import React, {useState} from 'react';
import * as opentype from 'opentype.js';

interface FontPreviewProps {
  uploadedFont: opentype.Font;
  previewFontFamily: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({uploadedFont, previewFontFamily}) => {
  const [previewText, setPreviewText] = useState('Preview text');

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Preview font</h2>
      <div className="border border-gray-300 rounded-lg p-4">
        <input
          type="text"
          value={previewText}
          onChange={e => setPreviewText(e.target.value)}
          placeholder="Input text to preview"
          className="w-full p-2 border border-gray-200 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div
          className="text-2xl p-4 bg-gray-50 rounded"
          style={{
            fontFamily: previewFontFamily || 'serif',
            minHeight: '60px',
          }}
        >
          {previewText}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Font name: {uploadedFont.names.fontFamily?.en || uploadedFont.names.fontFamily?.ko || 'Unknown'}
        </div>
      </div>
    </div>
  );
};
