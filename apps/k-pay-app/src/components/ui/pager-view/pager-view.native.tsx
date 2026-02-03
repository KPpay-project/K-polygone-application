import React from 'react';
import PagerView from 'react-native-pager-view';
import { ViewProps } from 'react-native';

interface PagerViewWrapperProps extends ViewProps {
  initialPage?: number;
  onPageSelected?: (event: any) => void;
  children: React.ReactNode;
}

export const PagerViewWrapper = React.forwardRef<
  PagerView,
  PagerViewWrapperProps
>(({ initialPage = 0, onPageSelected, children, ...props }, ref) => {
  return (
    <PagerView
      ref={ref}
      initialPage={initialPage}
      onPageSelected={onPageSelected}
      scrollEnabled={true}
      {...props}
    >
      {children}
    </PagerView>
  );
});
