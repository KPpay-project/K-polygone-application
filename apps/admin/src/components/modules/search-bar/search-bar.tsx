import { Search, X } from 'lucide-react';
import { forwardRef, InputHTMLAttributes } from 'react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  searchIconPosition?: 'left' | 'right';
  customIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onClear,
      showClearButton = true,
      variant = 'default',
      size = 'md',
      searchIconPosition = 'right',
      customIcon,
      placeholder = 'Search...',
      disabled = false,
      containerClassName = '',
      inputClassName = '',
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3',
      lg: 'px-5 py-4 text-lg'
    };

    const variantClasses = {
      default: 'border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      filled:
        'border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      outline: 'border-2 border-gray-300 bg-transparent focus:ring-0 focus:border-blue-500'
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const handleClear = () => {
      onChange('');
      onClear?.();
    };

    const renderIcon = () => {
      if (customIcon) return customIcon;
      return <Search className={`${iconSizeClasses[size]} text-gray-400`} />;
    };

    const inputPadding =
      searchIconPosition === 'left'
        ? size === 'sm'
          ? 'pl-9 pr-3'
          : size === 'lg'
            ? 'pl-14 pr-5'
            : 'pl-12 pr-4'
        : size === 'sm'
          ? 'pl-3 pr-9'
          : size === 'lg'
            ? 'pl-5 pr-14'
            : 'pl-4 pr-12';

    const clearButtonPadding =
      showClearButton && value
        ? searchIconPosition === 'right'
          ? size === 'sm'
            ? 'pr-16'
            : size === 'lg'
              ? 'pr-20'
              : 'pr-18'
          : size === 'sm'
            ? 'pr-9'
            : size === 'lg'
              ? 'pr-14'
              : 'pr-12'
        : '';

    return (
      <div className={`relative ${containerClassName}`}>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
          w-full rounded-xl transition-all duration-200 text-gray-700 placeholder-gray-400
          ${sizeClasses[size]} ${variantClasses[variant]} ${inputPadding} ${clearButtonPadding}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
          ${inputClassName} ${className}
        `}
          {...props}
        />

        {searchIconPosition === 'left' && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${disabled ? 'opacity-50' : ''}`}>
            {renderIcon()}
          </div>
        )}

        {searchIconPosition === 'right' && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${disabled ? 'opacity-50' : ''}`}>
            {renderIcon()}
          </div>
        )}

        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className={`
            absolute top-1/2 transform -translate-y-1/2 p-1 rounded-full
            text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150
            ${searchIconPosition === 'right' ? 'right-10' : 'right-3'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
          `}
          >
            <X className={iconSizeClasses[size]} />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
