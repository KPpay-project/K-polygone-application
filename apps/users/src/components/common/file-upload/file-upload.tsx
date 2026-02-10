//@ts-nocheck
import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { Button } from 'k-polygon-assets';
import { useFileUpload } from '@/hooks/api/use-file-upload';
import { formatFileSize, isImageFile, createImagePreview } from '@/utils/upload';

interface FileUploadProps {
  onFileUpload?: (url: string, file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showPreview?: boolean;
}

interface UploadedFile {
  file: File;
  url?: string;
  preview?: string;
  uploading?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onError,
  accept = '.jpg,.jpeg,.png,.pdf',
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  folder = 'documents',
  multiple = false,
  disabled = false,
  className = '',
  placeholder = 'Click to upload or drag and drop',
  showPreview = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { uploadFile, uploading, progress } = useFileUpload({
    maxSize,
    allowedTypes,
    folder,
    onSuccess: (result) => {
      setUploadedFiles((prev) => prev.map((f) => (f.uploading ? { ...f, url: result.url, uploading: false } : f)));
      const uploadingFile = uploadedFiles.find((f) => f.uploading);
      if (uploadingFile) {
        onFileUpload?.(result.url, uploadingFile.file);
      }
    },
    onError: (errorMsg) => {
      setUploadedFiles((prev) => prev.map((f) => (f.uploading ? { ...f, error: errorMsg, uploading: false } : f)));
      onError?.(errorMsg);
    }
  });

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const fileData: UploadedFile = {
          file,
          uploading: true
        };

        if (showPreview && isImageFile(file)) {
          try {
            fileData.preview = await createImagePreview(file);
          } catch (error) {
            console.warn('Failed to create preview:', error);
          }
        }

        if (!multiple) {
          setUploadedFiles([fileData]);
        } else {
          setUploadedFiles((prev) => [...prev, fileData]);
        }

        try {
          await uploadFile(file);
        } catch {
          // Error is handled by the hook
        }
      }
    },
    [uploadFile, disabled, multiple, showPreview]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!disabled) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect, disabled]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderFilePreview = (fileData: UploadedFile, index: number) => (
    <div key={index} className="relative border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {fileData.preview ? (
            <img src={fileData.preview} alt="Preview" className="w-12 h-12 object-cover rounded" />
          ) : isImageFile(fileData.file) ? (
            <Image className="w-12 h-12 text-gray-400" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}

          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-40">{fileData.file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(fileData.file.size)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {fileData.uploading && (
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{progress.percentage}%</span>
            </div>
          )}

          {fileData.error && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs ml-1">{fileData.error}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFile(index)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="mt-4">
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.split(',').join(', ')} up to {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((fileData, index) => renderFilePreview(fileData, index))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
