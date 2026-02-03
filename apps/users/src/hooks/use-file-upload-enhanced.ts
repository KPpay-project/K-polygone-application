import { useState, useCallback } from 'react';
import {
  FileUploadResult,
  UploadProgress,
  FileUploadCallback,
  validateFile,
  formatFileSize,
  getFileTypeIcon,
  isImageFile,
  createImagePreview
} from '../utils/upload';

export interface UseFileUploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: FileUploadCallback;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: string) => void;
}

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<FileUploadResult>;
  uploadFiles: (files: File[]) => Promise<FileUploadResult[]>;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  reset: () => void;
  validateFile: (file: File) => { isValid: boolean; error?: string };
  // Utility functions
  formatFileSize: (bytes: number) => string;
  getFileTypeIcon: (filename: string) => string;
  isImageFile: (file: File) => boolean;
  createImagePreview: (file: File) => Promise<string>;
}

export const useFileUploadEnhanced = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    onProgress,
    onSuccess,
    onError
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
  }, []);

  const validateFileInput = useCallback(
    (file: File) => {
      return validateFile(file, { maxSize, allowedTypes });
    },
    [maxSize, allowedTypes]
  );

  const uploadSingleFile = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      // Validate file first
      const validation = validateFileInput(file);
      if (!validation.isValid) {
        const errorMsg = validation.error || 'File validation failed';
        setError(errorMsg);
        onError?.(errorMsg);
        throw new Error(errorMsg);
      }

      setIsUploading(true);
      setError(null);

      try {
        // Since we don't have a real upload service, we'll simulate the process
        // and return the file as a data URL for preview purposes
        const progressData: UploadProgress = {
          loaded: 100,
          total: 100,
          percentage: 100
        };
        setProgress(progressData);
        onProgress?.(progressData);

        // Create a mock result - in a real app, this would be handled by a proper upload service
        const uploadResult: FileUploadResult = {
          url: URL.createObjectURL(file), // Temporary URL for preview
          filename: file.name,
          success: true
        };

        onSuccess?.(uploadResult);
        return uploadResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMsg);
        onError?.(errorMsg);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFileInput, onProgress, onSuccess, onError]
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[]): Promise<FileUploadResult[]> => {
      const results: FileUploadResult[] = [];

      for (let i = 0; i < files.length; i++) {
        try {
          const result = await uploadSingleFile(files[i]);
          results.push(result);
        } catch (error) {
          // Continue with other files even if one fails
          results.push({
            url: '',
            filename: files[i].name,
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
          });
        }
      }

      return results;
    },
    [uploadSingleFile]
  );

  return {
    uploadFile: uploadSingleFile,
    uploadFiles: uploadMultipleFiles,
    isUploading,
    progress,
    error,
    reset,
    validateFile: validateFileInput,
    // Utility functions
    formatFileSize,
    getFileTypeIcon,
    isImageFile,
    createImagePreview
  };
};

export default useFileUploadEnhanced;
