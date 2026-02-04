import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography utilities for consistent text styling
 */
export const typography = {
  // Headers
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',

  // Body text
  body: 'text-base font-normal',
  bodyMedium: 'text-base font-medium',
  bodySemibold: 'text-base font-semibold',

  // Small text
  small: 'text-sm font-normal',
  smallMedium: 'text-sm font-medium',
  smallSemibold: 'text-sm font-semibold',

  // Extra small
  xs: 'text-xs font-normal',
  xsMedium: 'text-xs font-medium',
  xsSemibold: 'text-xs font-semibold',

  // Large text
  large: 'text-lg font-normal',
  largeMedium: 'text-lg font-medium',
  largeSemibold: 'text-lg font-semibold'
};

/**
 * Border radius utilities for consistent rounded corners
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  default: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full'
};

/**
 * Common color utilities for consistent theming
 */
export const colors = {
  // Primary colors
  primary: {
    50: 'bg-blue-50 text-blue-600',
    100: 'bg-blue-100 text-blue-700',
    500: 'bg-blue-500 text-white',
    600: 'bg-blue-600 text-white',
    700: 'bg-blue-700 text-white',
    800: 'bg-blue-800 text-white'
  },

  // Status colors
  success: {
    50: 'bg-green-50 text-green-600',
    100: 'bg-green-100 text-green-700',
    500: 'bg-green-500 text-white',
    600: 'bg-green-600 text-white'
  },

  warning: {
    50: 'bg-yellow-50 text-yellow-600',
    100: 'bg-yellow-100 text-yellow-700',
    500: 'bg-yellow-500 text-white',
    600: 'bg-yellow-600 text-white'
  },

  error: {
    50: 'bg-red-50 text-red-600',
    100: 'bg-red-100 text-red-700',
    500: 'bg-red-500 text-white',
    600: 'bg-red-600 text-white'
  },

  // Gray scale
  gray: {
    50: 'bg-gray-50 text-gray-600',
    100: 'bg-gray-100 text-gray-700',
    200: 'bg-gray-200 text-gray-800',
    300: 'bg-gray-300 text-gray-900',
    400: 'bg-gray-400 text-white',
    500: 'bg-gray-500 text-white',
    600: 'bg-gray-600 text-white',
    700: 'bg-gray-700 text-white',
    800: 'bg-gray-800 text-white',
    900: 'bg-gray-900 text-white'
  }
};

/**
 * Shadow utilities for consistent elevation
 */
export const shadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  default: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl'
};

/**
 * Common layout utilities
 */
export const layout = {
  // Flexbox utilities
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Grid utilities
  gridCenter: 'grid place-items-center',

  // Spacing
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
};

/**
 * Button style utilities
 */
export const buttonStyles = {
  // Base styles
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',

  // Sizes
  sizes: {
    sm: 'h-9 px-3',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
    xl: 'h-12 px-10'
  },

  // Variants
  variants: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-gray-300 text-gray-700 hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  }
};

/**
 * Card style utilities
 */
export const cardStyles = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-2xl font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0'
};

/**
 * Input style utilities
 */
export const inputStyles = {
  base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'border-destructive focus-visible:ring-destructive',
  success: 'border-green-500 focus-visible:ring-green-500'
};

/**
 * Status indicator utilities
 */
export const statusIndicators = {
  dot: {
    active: 'w-2 h-2 rounded-full bg-green-500',
    inactive: 'w-2 h-2 rounded-full bg-red-500',
    pending: 'w-2 h-2 rounded-full bg-yellow-500',
    neutral: 'w-2 h-2 rounded-full bg-gray-400'
  },

  badge: {
    active: 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium',
    inactive: 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium',
    pending: 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium',
    neutral: 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium'
  }
};

/**
 * Animation utilities
 */
export const animations = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  fadeIn: 'animate-in fade-in-0',
  fadeOut: 'animate-out fade-out-0',
  slideIn: 'animate-in slide-in-from-left-full',
  slideOut: 'animate-out slide-out-to-right-full'
};

/**
 * Hover state utilities
 */
export const hoverStates = {
  // Text colors
  textHover: {
    primary: 'hover:text-blue-600',
    secondary: 'hover:text-gray-600',
    success: 'hover:text-green-600',
    warning: 'hover:text-yellow-600',
    error: 'hover:text-red-600'
  },

  // Background colors
  bgHover: {
    primary: 'hover:bg-blue-50',
    secondary: 'hover:bg-gray-50',
    success: 'hover:bg-green-50',
    warning: 'hover:bg-yellow-50',
    error: 'hover:bg-red-50'
  }
};

/**
 * Utility functions for dynamic styling
 */
export const styleUtils = {
  /**
   * Get status color classes based on status
   */
  getStatusColor: (status: string) => {
    const statusMap: Record<string, string> = {
      active: colors.success[100],
      inactive: colors.error[100],
      pending: colors.warning[100],
      completed: colors.success[100],
      failed: colors.error[100],
      cancelled: colors.gray[100]
    };
    return statusMap[status.toLowerCase()] || colors.gray[100];
  },

  /**
   * Get status dot color based on status
   */
  getStatusDot: (status: string) => {
    const statusMap: Record<string, string> = {
      active: statusIndicators.dot.active,
      inactive: statusIndicators.dot.inactive,
      pending: statusIndicators.dot.pending,
      completed: statusIndicators.dot.active,
      failed: statusIndicators.dot.inactive
    };
    return statusMap[status.toLowerCase()] || statusIndicators.dot.neutral;
  },

  /**
   * Combine multiple style utilities
   */
  combine: (...styles: string[]) => cn(...styles)
};

/**
 * Common component style presets
 */
export const presets = {
  // Modal styles
  modal: {
    overlay: 'fixed inset-0 z-50 bg-black/50',
    content:
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
    header: 'flex flex-col space-y-1.5 text-center sm:text-left',
    title: 'text-lg font-semibold',
    description: 'text-sm text-muted-foreground',
    footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'
  },

  // Table styles
  table: {
    container: 'relative w-full overflow-auto',
    table: 'w-full caption-bottom text-sm',
    header: '[&_tr]:border-b',
    body: '[&_tr:last-child]:border-0',
    row: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    head: 'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
    cell: 'p-4 align-middle'
  },

  // Form styles
  form: {
    group: 'space-y-2',
    label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    input: inputStyles.base,
    error: 'text-sm font-medium text-destructive',
    description: 'text-sm text-muted-foreground'
  }
};
