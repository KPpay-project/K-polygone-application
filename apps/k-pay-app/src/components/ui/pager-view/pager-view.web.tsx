import React from 'react';
import { ViewProps, ScrollView, Platform } from 'react-native';
import PagerView from 'react-native-pager-view';

interface PagerViewWrapperProps extends ViewProps {
  initialPage?: number;
  onPageSelected?: (event: any) => void;
  children: React.ReactNode;
}

export const PagerViewWrapper = React.forwardRef<any, PagerViewWrapperProps>(
  ({ initialPage = 0, onPageSelected, children, ...props }, ref) => {
    if (Platform.OS === 'web') {
      return (
        <ScrollView
          ref={ref}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <PagerView
        ref={ref}
        initialPage={initialPage}
        onPageSelected={onPageSelected}
        scrollEnabled={true}
        style={{ flex: 1 }}
        {...props}
      >
        {children}
      </PagerView>
    );
  }
);
