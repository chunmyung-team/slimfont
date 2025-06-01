import React, {useRef} from 'react';

interface FontUploaderProps {
  fontName: string;
  onFileUpload: (file: File) => Promise<void>;
}

export const FontUploader: React.FC<FontUploaderProps> = ({fontName, onFileUpload}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onFileUpload(file);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading file');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload font file</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={handleFileChange}
          className="hidden"
          id="font-upload"
        />
        <label htmlFor="font-upload" className="cursor-pointer flex flex-col items-center p-6">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-600">{fontName ? fontName : 'Select TTF, OTF, WOFF, WOFF2 file'}</span>
        </label>
      </div>
    </div>
  );
};
