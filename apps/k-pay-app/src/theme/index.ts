// Theme configuration for K-Pay app
// Centralizes colors, spacing, typography, and other design tokens

export const theme = {
  colors: {
    // Base colors
    white: '#FFFFFF',
    black: '#000000',

    // Blue color palette
    blue: {
      50: '#EBF4FF',
      100: '#DBEAFF',
      200: '#BED7FF',
      300: '#97BCFF',
      400: '#6E94FF',
      500: '#4D6DFF',
      600: '#2D42FE',
      700: '#1A4ED8',
      800: '#2D00F7',
      900: '#00009C',
      DEFAULT: '#1A4ED8',
    },

    // Primary colors
    primary: {
      50: '#EBF4FF',
      100: '#DBEAFF',
      200: '#BED7FF',
      300: '#97BCFF',
      400: '#6E94FF',
      500: '#4D6DFF',
      600: '#2D42FE',
      700: '#1A4ED8',
      800: '#2D00F7',
      900: '#00009C',
      DEFAULT: '#1A4ED8',
    },

    // Secondary colors
    secondary: {
      DEFAULT: '#040727',
    },

    // Gray scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Green color palette
    green: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      DEFAULT: '#10B981',
    },

    // Orange color palette
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
      DEFAULT: '#F97316',
    },

    // Red color palette
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      DEFAULT: '#EF4444',
    },

    // Status colors
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
    },

    warning: {
      50: '#FFFCF5',
      100: '#FFF9C5',
      200: '#FFF08A',
      300: '#FFE047',
      400: '#FAC215',
      500: '#E3A008',
      600: '#A16207',
      700: '#92400E',
    },

    error: {
      50: '#FFE7E7',
      100: '#FFD1D1',
      200: '#FFB3B3',
      300: '#FF8C8C',
      400: '#FF6C6C',
      500: '#FF4040',
      600: '#E62C2C',
      700: '#C41212',
    },

    // Additional colors
    background: {
      primary: '#FFFFFF',
      DEFAULT: '#FFFFFF',
    },
    surface: '#FFFFFF',
    card: '#F9FAFB',
    border: '#E5E7EB',
    input: '#F3F4F6',
    muted: '#F6F6F6',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Helper functions for consistent styling
export const getColor = (colorPath: string) => {
  const keys = colorPath.split('.');
  let result: any = theme.colors;

  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path '${colorPath}' not found in theme`);
      return theme.colors.gray[500];
    }
  }

  return result;
};

export const getSpacing = (size: keyof typeof theme.spacing) => {
  return theme.spacing[size] || theme.spacing.md;
};

export const getFontSize = (size: keyof typeof theme.fontSize) => {
  return theme.fontSize[size] || theme.fontSize.base;
};

export const getBorderRadius = (size: keyof typeof theme.borderRadius) => {
  return theme.borderRadius[size] || theme.borderRadius.md;
};

export const getShadow = (size: keyof typeof theme.shadows) => {
  return theme.shadows[size] || theme.shadows.sm;
};

// Export default theme
export default theme;
