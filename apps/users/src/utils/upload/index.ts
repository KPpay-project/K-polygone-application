import { gql } from '@apollo/client';

export interface FileUploadResult {
  url: string;
  filename: string;
  success: boolean;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type FileUploadCallback = (progress: UploadProgress) => void;

export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $folder: String) {
    uploadFile(file: $file, folder: $folder) {
      success
      message
      url
      filename
    }
  }
`;

/**
 * Validates file before upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  }
): { isValid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'] } = options;

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must not exceed ${Math.round(maxSize / (1024 * 1024))}MB`
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.map((type) => type.split('/')[1]).join(', ')}`
    };
  }

  return { isValid: true };
};

export const prepareFileForUpload = (file: File): File => {
  // For Apollo Client with apollo-upload-client, we can pass the File directly
  return file;
};

/**
 * Creates a file upload promise with progress tracking
 */
export const createFileUploadPromise = (
  uploadMutation: any,
  file: File,
  folder?: string,
  onProgress?: FileUploadCallback
): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 15, 90);
      onProgress?.({
        loaded: progress,
        total: 100,
        percentage: Math.round(progress)
      });
    }, 200);

    uploadMutation({
      variables: {
        file: prepareFileForUpload(file),
        folder: folder || 'documents'
      }
    })
      .then((result: any) => {
        clearInterval(progressInterval);

        // Complete the progress
        onProgress?.({
          loaded: 100,
          total: 100,
          percentage: 100
        });

        const uploadData = result.data?.uploadFile;

        if (uploadData?.success) {
          resolve({
            url: uploadData.url,
            filename: uploadData.filename || file.name,
            success: true
          });
        } else {
          reject(new Error(uploadData?.message || 'Upload failed'));
        }
      })
      .catch((error: Error) => {
        clearInterval(progressInterval);
        reject(error);
      });
  });
};

/**
 * File type mappings for display
 */
export const getFileTypeIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return '📄';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    case 'doc':
    case 'docx':
      return '📝';
    default:
      return '📁';
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract filename from URL
 */
export const getFilenameFromUrl = (url: string): string => {
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'file';
  } catch {
    return 'file';
  }
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Create preview URL for images
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
