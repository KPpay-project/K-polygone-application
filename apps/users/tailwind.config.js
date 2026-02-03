/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../k-pay-assets/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ovaley: '#464141',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          50: '#EBF4FF',
          100: '#DBEAFF',
          200: '#BED7FF',
          300: '#97BCFF',
          400: '#6E94FF',
          500: '#4D6DFF',
          600: '#2D42FE',
          700: '#1E2EDE',
          800: '#2D00F7',
          dark: '#03035C',
          DEFAULT: '#FF0033',
          strokeFade: '#2E4BF1',
          backgroundFade: '#0022FF',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },

        brand: {
          default: '#1E2EDE',
          natural: '#374151',
          secondary: '#040727',
          muted: '#F6F6F6'
        },
        brandBlue: {
          50: '#EBF4FF',
          100: '#DBEAFF',
          200: '#BED7FF',
          300: '#97BCFF',
          400: '#6E94FF',
          500: '#4D6DFF',
          600: '#2D42FE',
          700: '#1E2EDE'
        },

        brandNatural: {},

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
          900: '#111827'
        },
        blue: {
          50: '#F1F6FF',
          100: '#E3EEFF',
          200: '#C7DFFF',
          300: '#A6CEFF',
          400: '#89B9FF',
          500: '#5C96FF',
          600: '#2366F2',
          700: '#1A4ED8'
        },
        red: {
          50: '#FFE7E7',
          100: '#FFD1D1',
          200: '#FFB3B3',
          300: '#FF8C8C',
          400: '#FF6C6C',
          500: '#FF4040',
          600: '#E62C2C',
          700: '#C41212'
        },

        warning: {
          50: '#FFFCF5',
          100: '#FFF9C5',
          200: '#FFF08A',
          300: '#FFE047',
          400: '#FAC215',
          500: '#E3A008',
          600: '#A16207',
          700: '#92400E'
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        status: {}
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')]
});
