import React, { useRef, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from 'k-polygon-assets';

interface SimpleFileUploadProps {
  value?: File | string;
  onChange?: (file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  fileName: string | null;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
  value,
  onChange,
  onError,
  accept = '.jpg,.jpeg,.png,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className = '',
  placeholder = 'Click to upload or drag and drop'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    fileName: null
  });

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must not exceed ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }

    const allowedTypes = accept.split(',').map((type) => {
      if (type.startsWith('.')) {
        const ext = type.slice(1);
        switch (ext) {
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          case 'pdf':
            return 'application/pdf';
          default:
            return `application/${ext}`;
        }
      }
      return type;
    });

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed: ${accept}`
      };
    }

    return { isValid: true };
  };

  const uploadFile = async (file: File): Promise<File> => {
    setUploadState((prev) => ({ ...prev, uploading: true, progress: 0, error: null, fileName: file.name }));

    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        const newProgress = Math.min(prev.progress + Math.random() * 15, 90);
        return { ...prev, progress: newProgress };
      });
    }, 300);

    try {
      // For now, just simulate upload and return the file
      // In production, you'd use the real upload mutation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadState((prev) => ({ ...prev, uploading: false, progress: 100 }));
      return file;
    } catch (error) {
      clearInterval(progressInterval);
      setUploadState((prev) => ({
        ...prev,
        uploading: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const file = files[0];
    const validation = validateFile(file);

    if (!validation.isValid) {
      setUploadState((prev) => ({ ...prev, error: validation.error! }));
      onError?.(validation.error!);
      return;
    }

    try {
      const uploadedFile = await uploadFile(file);
      onChange?.(uploadedFile);
      setUploadState((prev) => ({ ...prev, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState((prev) => ({ ...prev, uploading: false, error: errorMessage }));
      onError?.(errorMessage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const clearFile = () => {
    onChange?.(null as any);
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      fileName: null
    });
  };

  const hasValue = value && (value instanceof File || (typeof value === 'string' && value.length > 0));
  const isUploaded = hasValue && !uploadState.uploading;

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${uploadState.uploading ? 'pointer-events-none' : ''}
          ${isUploaded ? 'border-green-300 bg-green-50' : ''}
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
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          {uploadState.uploading ? (
            <div className="space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div>
                <p className="text-sm text-gray-600">Uploading {uploadState.fileName}...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(uploadState.progress)}%</p>
              </div>
            </div>
          ) : isUploaded ? (
            <div className="space-y-2">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-700">File uploaded successfully</p>
                <p className="text-xs text-gray-500">{uploadState.fileName || 'Document'}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className={`mx-auto h-8 w-8 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm text-gray-600">{placeholder}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {accept.split(',').join(', ')} up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {uploadState.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{uploadState.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleFileUpload;
