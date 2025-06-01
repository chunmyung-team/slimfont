import React from 'react';

export const InfoSection: React.FC = () => {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-2">How to use</h3>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Upload TTF, OTF, WOFF, WOFF2 font files</li>
        <li>• Input characters you want to include</li>
        <li>• The font will be downloaded in TTF format</li>
        <li>• Duplicate characters are automatically removed</li>
      </ul>
    </div>
  );
};
