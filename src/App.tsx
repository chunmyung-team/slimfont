import React, {useState, useRef, useEffect} from 'react';
import * as opentype from 'opentype.js';
import {saveAs} from 'file-saver';
import './index.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [uploadedFont, setUploadedFont] = useState<opentype.Font | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewText, setPreviewText] = useState('Preview text');
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState<string>('');
  const [previewFontFamily, setPreviewFontFamily] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const font = opentype.parse(arrayBuffer);
      setUploadedFont(font);
      setFontName(file.name);

      // 폰트 파일을 URL로 변환하여 미리보기에 사용
      const blob = new Blob([arrayBuffer], {type: 'font/truetype'});
      const url = URL.createObjectURL(blob);
      setFontUrl(url);
    } catch (error) {
      alert('Error reading font file.');
      console.error(error);
    }
  };

  // 폰트 URL이 변경될 때마다 CSS font-face 규칙을 동적으로 추가
  useEffect(() => {
    if (fontUrl && uploadedFont) {
      const fontFamilyName = `PreviewFont_${Date.now()}`;
      setPreviewFontFamily(fontFamilyName);

      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${fontFamilyName}';
          src: url('${fontUrl}') format('truetype');
        }
      `;
      document.head.appendChild(style);

      // 이전 스타일 태그 정리
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, [fontUrl, uploadedFont]);

  const getUniqueCharacters = (text: string): string[] => {
    return Array.from(new Set(text.split('')));
  };

  const createSubsetFont = async () => {
    if (!uploadedFont || !inputText.trim()) {
      alert('Please input font file and text.');
      return;
    }

    setIsProcessing(true);

    try {
      const uniqueChars = getUniqueCharacters(inputText);
      const glyphs = [uploadedFont.glyphs.get(0)]; // .notdef glyph

      // 입력된 문자들에 해당하는 글리프만 추출
      uniqueChars.forEach(char => {
        const glyph = uploadedFont.charToGlyph(char);
        if (glyph && glyph.index !== 0) {
          glyphs.push(glyph);
        }
      });

      // 새로운 폰트 생성
      const subsetFont = new opentype.Font({
        familyName: uploadedFont.names.fontFamily.en || 'SubsetFont',
        styleName: uploadedFont.names.fontSubfamily.en || 'Regular',
        unitsPerEm: uploadedFont.unitsPerEm,
        ascender: uploadedFont.ascender,
        descender: uploadedFont.descender,
        glyphs: glyphs,
      });

      // 폰트를 ArrayBuffer로 변환
      const fontBuffer = subsetFont.toArrayBuffer();

      // 파일 다운로드
      const blob = new Blob([fontBuffer], {type: 'font/truetype'});
      const fileName = `${fontName.replace(/\.[^/.]+$/, '')}_subset.ttf`;
      saveAs(blob, fileName);
    } catch (error) {
      alert('Error processing font.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setUploadedFont(null);
    setFontName('');
    setPreviewText('Preview text');
    setPreviewFontFamily('');
    if (fontUrl) {
      URL.revokeObjectURL(fontUrl);
      setFontUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SlimFont</h1>
          <p className="text-gray-600">Webfont picker for lightweight</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Upload font file</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
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

          {/* 텍스트 입력 섹션 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Input characters to include</h2>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Input characters you want to include. e.g. 안녕하세요 123"
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="mt-2 text-sm text-gray-500">
              Number of characters to save: {getUniqueCharacters(inputText).length}
            </div>
          </div>

          {/* 미리보기 섹션 */}
          {uploadedFont && (
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
          )}

          {/* 액션 버튼들 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={createSubsetFont}
              disabled={!uploadedFont || !inputText.trim() || isProcessing}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isProcessing ? 'Processing...' : 'Download'}
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Reset
            </button>
          </div>

          {/* 정보 섹션 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How to use</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload TTF, OTF, WOFF, WOFF2 font files</li>
              <li>• Input characters you want to include</li>
              <li>• The font will be downloaded in TTF format</li>
              <li>• Duplicate characters are automatically removed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
