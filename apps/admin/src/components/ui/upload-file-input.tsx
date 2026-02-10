import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadFileInputProps {
  label?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const UploadFileInput: React.FC<UploadFileInputProps> = ({
  label = 'Upload Logo',
  accept = 'image/*',
  onChange,
  placeholder = 'Choose File',
  className,
  disabled = false,
  required = false,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onClick={handleClick}
        className={`
          relative flex py-1 px-2 items-center w-full border border-gray-300 rounded-lg overflow-hidden cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
          ${error ? 'border-red-500' : ''}
          transition-colors
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-sm font-medium text-blue-600 rounded-lg">
          <Upload className="w-4 h-4" />
          {placeholder}
        </div>

        <div className="flex-1 px-4 py-2.5 text-sm text-gray-500">
          {selectedFile ? selectedFile.name : 'No File Chosen'}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default UploadFileInput;
