import React from 'react';

interface ActionButtonsProps {
  onDownload: () => Promise<void>;
  onReset: () => void;
  isDisabled: boolean;
  isProcessing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({onDownload, onReset, isDisabled, isProcessing}) => {
  const handleDownload = async () => {
    try {
      await onDownload();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error processing font');
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={handleDownload}
        disabled={isDisabled || isProcessing}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isProcessing ? 'Processing...' : 'Download'}
      </button>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
      >
        Reset
      </button>
    </div>
  );
};
