import React from 'react';

interface ActionButtonsProps {
  onDownload: (format: 'ttf' | 'woff') => Promise<void>;
  onReset: () => void;
  isDisabled: boolean;
  isProcessing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({onDownload, onReset, isDisabled, isProcessing}) => {
  const handleDownload = async (format: 'ttf' | 'woff') => {
    try {
      await onDownload(format);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error processing font');
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => handleDownload('ttf')}
        disabled={isDisabled || isProcessing}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isProcessing ? 'Processing...' : 'Download TTF'}
      </button>
      <button
        onClick={() => handleDownload('woff')}
        disabled={isDisabled || isProcessing}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isProcessing ? 'Processing...' : 'Download WOFF'}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  );
};
