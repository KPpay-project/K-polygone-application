import React, { ReactNode } from 'react';
import { View, ScrollView, ViewProps, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DismissKeyboardView from '../components/ui/dismiss-keyboard-view/dismiss-keyboard-view';

export interface ContainerLayoutProps extends ViewProps {
  children: ReactNode;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
  useSafeArea?: boolean;

  flex?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;

  backgroundColor?: string;

  scrollable?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'style'>;

  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  variant?: 'default' | 'fullscreen' | 'card' | 'modal' | 'centered';
  className?: string;
}

export const ContainerLayout: React.FC<ContainerLayoutProps> = ({
  children,
  edges,
  useSafeArea = true,
  flex = 1,
  backgroundColor = 'bg-white',
  scrollable = false,
  scrollProps,
  direction = 'column',
  justify = 'flex-start',
  align = 'stretch',
  wrap = 'nowrap',
  variant = 'default',
  className = '',

  ...rest
}) => {
  const flexClass = flex ? `flex-${flex}` : '';
  const directionClass = direction ? `flex-${direction}` : '';
  const justifyClass = justify ? `justify-${justify.replace('flex-', '')}` : '';
  const alignClass = align ? `items-${align.replace('flex-', '')}` : '';
  const wrapClass = wrap !== 'nowrap' ? `flex-${wrap}` : '';

  const variantClass = getVariantClass(variant);

  const content = scrollable ? (
    <DismissKeyboardView>
      <ScrollView style={{ flex: 1 }} {...scrollProps}>
        {children}
      </ScrollView>
    </DismissKeyboardView>
  ) : (
    <DismissKeyboardView>
      <View style={{ flex: 1 }}>{children}</View>
    </DismissKeyboardView>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#ffffff' }}
        edges={edges}
        {...rest}
      >
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }} {...rest}>
      {content}
    </View>
  );
};

const getVariantClass = (variant: ContainerLayoutProps['variant']) => {
  switch (variant) {
    case 'fullscreen':
      return 'absolute top-0 left-0 right-0 bottom-0';
    case 'card':
      return 'mx-4 my-2 rounded-xl shadow-md';
    case 'modal':
      return 'm-5 rounded-2xl p-5 shadow-lg';
    case 'centered':
      return 'justify-center items-center';
    default:
      return '';
  }
};

export const ScreenContainer: React.FC<
  Omit<ContainerLayoutProps, 'variant'>
> = (props) => <ContainerLayout variant="default" {...props} />;

export const CardContainer: React.FC<Omit<ContainerLayoutProps, 'variant'>> = (
  props
) => <ContainerLayout variant="card" useSafeArea={false} {...props} />;

export const ModalContainer: React.FC<Omit<ContainerLayoutProps, 'variant'>> = (
  props
) => <ContainerLayout variant="modal" useSafeArea={false} {...props} />;

export const CenteredContainer: React.FC<
  Omit<ContainerLayoutProps, 'variant'>
> = (props) => <ContainerLayout variant="centered" {...props} />;

export const ScrollContainer: React.FC<
  Omit<ContainerLayoutProps, 'scrollable'>
> = (props) => <ContainerLayout scrollable={true} {...props} />;
