import {useState} from 'react';

interface UseDragAndDropProps {
  onFileUpload: (file: File) => Promise<void>;
  allowedExtensions?: string[];
}

export const useDragAndDrop = ({
  onFileUpload,
  allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2'],
}: UseDragAndDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFileType = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFileType(file)) {
      alert(`Supported file formats: ${allowedExtensions.join(', ').toUpperCase()}`);
      return;
    }

    try {
      await onFileUpload(file);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await handleFileUpload(file);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await handleFileUpload(file);
  };

  return {
    isDragOver,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    handleFileChange,
  };
};
