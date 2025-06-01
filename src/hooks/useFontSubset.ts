import {useState, useEffect} from 'react';
import * as opentype from 'opentype.js';
import {saveAs} from 'file-saver';

export const useFontSubset = () => {
  const [uploadedFont, setUploadedFont] = useState<opentype.Font | null>(null);
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState<string>('');
  const [previewFontFamily, setPreviewFontFamily] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleFileUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const font = opentype.parse(arrayBuffer);
      setUploadedFont(font);
      setFontName(file.name);

      // 폰트 파일을 URL로 변환하여 미리보기에 사용
      const blob = new Blob([arrayBuffer], {type: 'font/truetype'});
      const url = URL.createObjectURL(blob);
      setFontUrl(url);
    } catch {
      throw new Error('Error reading font file.');
    }
  };

  const getUniqueCharacters = (text: string): string[] => {
    return Array.from(new Set(text.split('')));
  };

  const createSubsetFont = async (inputText: string) => {
    if (!uploadedFont || !inputText.trim()) {
      throw new Error('Please input font file and text.');
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
    } catch {
      throw new Error('Error processing font.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFont = () => {
    setUploadedFont(null);
    setFontName('');
    setPreviewFontFamily('');
    if (fontUrl) {
      URL.revokeObjectURL(fontUrl);
      setFontUrl('');
    }
  };

  return {
    uploadedFont,
    fontName,
    previewFontFamily,
    isProcessing,
    handleFileUpload,
    createSubsetFont,
    resetFont,
    getUniqueCharacters,
  };
};
