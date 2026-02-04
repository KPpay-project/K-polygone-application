import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextProps, TextStyle } from 'react-native';
import { Text as NNText, StyleSheet } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface Props extends TextProps {
  className?: string;
  tx?: string; // translation key
}

export const CText = forwardRef<NNText, Props>(
  ({ className = '', style, children, tx, ...props }, ref) => {
    const { t } = useTranslation();
    const textStyle = useMemo(
      () =>
        twMerge(
          'text-base text-white  dark:text-white font-outfit font-normal',
          className
        ),
      [className]
    );

    const nStyle = useMemo(
      () =>
        StyleSheet.flatten([
          {
            writingDirection: 'rtl',
            fontFamily: 'Outfit_400Regular',
          },
          style,
        ]) as TextStyle,
      [style]
    );
    return (
      <NNText ref={ref} className={textStyle} style={nStyle} {...props}>
        {tx ? t(tx) : typeof children === 'string' ? t(children) : children}
      </NNText>
    );
  }
);
