import { useState, useCallback } from 'react';
import type { FileUploadResult, UploadProgress, FileUploadCallback } from '@/utils/upload';
import { validateFile } from '@/utils/upload';

interface UseFileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
  onProgress?: FileUploadCallback;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: string) => void;
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<FileUploadResult>;
  uploading: boolean;
  progress: UploadProgress;
  error: string | null;
  reset: () => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    onProgress,
    onSuccess,
    onError
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleProgress = useCallback(
    (progressData: UploadProgress) => {
      setProgress(progressData);
      onProgress?.(progressData);
    },
    [onProgress]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      setError(null);
      setUploading(true);
      setProgress({ loaded: 0, total: 0, percentage: 0 });

      try {
        // Validate file
        const validation = validateFile(file, { maxSize, allowedTypes });
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Simulate upload progress
        handleProgress({ loaded: 100, total: 100, percentage: 100 });

        // Create mock result for file preview
        const result: FileUploadResult = {
          url: URL.createObjectURL(file),
          filename: file.name,
          success: true
        };

        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [maxSize, allowedTypes, handleProgress, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setUploading(false);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
  }, []);

  return {
    uploadFile,
    uploading,
    progress,
    error,
    reset
  };
};

// Specialized hook for identity document uploads
export const useIdentityDocumentUpload = () => {
  return useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB for documents
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    folder: 'kyc/identity-documents'
  });
};

// Hook for general KYC document uploads
export const useKycDocumentUpload = () => {
  return useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'],
    folder: 'kyc/documents'
  });
};

// Hook for profile picture uploads
export const useProfilePictureUpload = () => {
  return useFileUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    folder: 'profile-pictures'
  });
};
