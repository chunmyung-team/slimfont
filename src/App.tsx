import React, {useState} from 'react';
import {useFontSubset} from './hooks';
import {FontUploader, TextInput, FontPreview, ActionButtons, InfoSection} from './components';
import './index.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');

  const {
    uploadedFont,
    fontName,
    previewFontFamily,
    isProcessing,
    handleFileUpload,
    createSubsetFont,
    resetFont,
    getUniqueCharacters,
  } = useFontSubset();

  const handleReset = () => {
    setInputText('');
    resetFont();
  };

  const handleDownload = async () => {
    await createSubsetFont(inputText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SlimFont</h1>
          <p className="text-gray-600">Webfont picker for lightweight</p>
        </div>

        {/* 메인 컨테이너 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <FontUploader fontName={fontName} onFileUpload={handleFileUpload} />

          <TextInput inputText={inputText} onTextChange={setInputText} getUniqueCharacters={getUniqueCharacters} />

          {uploadedFont && <FontPreview uploadedFont={uploadedFont} previewFontFamily={previewFontFamily} />}

          <ActionButtons
            onDownload={handleDownload}
            onReset={handleReset}
            isDisabled={!uploadedFont || !inputText.trim()}
            isProcessing={isProcessing}
          />

          <InfoSection />
        </div>
      </div>
    </div>
  );
};

export default App;
