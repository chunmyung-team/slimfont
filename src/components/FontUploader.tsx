import React, {useRef} from 'react';
import {useDragAndDrop} from '../hooks/useDragAndDrop';

interface FontUploaderProps {
  fontName: string;
  onFileUpload: (file: File) => Promise<void>;
}

export const FontUploader: React.FC<FontUploaderProps> = ({fontName, onFileUpload}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {isDragOver, dragHandlers, handleFileChange} = useDragAndDrop({onFileUpload});

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload font file</h2>
      <div
        className={`border-2 border-dashed rounded-lg text-center transition-all duration-200 ${
          isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400'
        }`}
        {...dragHandlers}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileChange}
          className="hidden"
          id="font-upload"
        />
        <label htmlFor="font-upload" className="cursor-pointer flex flex-col items-center p-6">
          <svg
            className={`w-12 h-12 mb-2 transition-colors ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className={`transition-colors ${isDragOver ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
            {fontName ? fontName : isDragOver ? 'Drop your file here' : 'Select or drag TTF, OTF, WOFF, WOFF2 file'}
          </span>
          {!fontName && <span className="text-sm text-gray-400 mt-1">Click to select or drag and drop to upload</span>}
        </label>
      </div>
    </div>
  );
};
