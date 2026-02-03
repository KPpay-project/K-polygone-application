import React from 'react';
import { TextProps, Text } from 'react-native';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'small'
  | 'button';

export type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'thin'
  | 'extraLight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold'
  | 'black';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: FontWeight;
  children: React.ReactNode;
  style?: any;
}

const getFontFamily = (weight: FontWeight): string => {
  switch (weight) {
    case '100':
    case 'thin':
      return 'Outfit_100Thin';
    case '200':
    case 'extraLight':
      return 'Outfit_200ExtraLight';
    case '300':
    case 'light':
      return 'Outfit_300Light';
    case '400':
    case 'regular':
      return 'Outfit_400Regular';
    case '500':
    case 'medium':
      return 'Outfit_500Medium';
    case '600':
    case 'semiBold':
      return 'Outfit_600SemiBold';
    case '700':
    case 'bold':
      return 'Outfit_700Bold';
    case '800':
    case 'extraBold':
      return 'Outfit_800ExtraBold';
    case '900':
    case 'black':
      return 'Outfit_900Black';
    default:
      return 'Outfit_400Regular';
  }
};

const variantStyles: Record<TypographyVariant, any> = {
  h1: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontFamily: 'Outfit_600SemiBold',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 18,
  },
  small: {
    fontSize: 12.5,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 18,
  },
  button: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    lineHeight: 24,
  },
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  weight,
  children,
  style,
  ...props
}) => {
  const baseStyle = variantStyles[variant] || variantStyles.body;
  const customFontFamily = weight ? getFontFamily(weight) : null;

  const computedStyle = [
    baseStyle,
    color ? { color } : {},
    customFontFamily ? { fontFamily: customFontFamily } : {},
    style,
  ];

  return (
    <Text style={computedStyle} {...props}>
      {children}
    </Text>
  );
};
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);
