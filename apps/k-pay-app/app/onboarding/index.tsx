import React, { useState, useRef } from 'react';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Button } from '@/components/ui/button/button';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { View, Platform } from 'react-native';
import { PagerViewWrapper } from '@/components/ui/pager-view';
import { OnboardingSlide } from '@/modules/onboarding/components/onboarding-slide';
import { Typography } from '@/components/ui';
import { Link } from 'expo-router';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

const getSlides = (t: any) => [
  {
    image: require('../../assets/first.png'),
    title: 'Seamless Payments Across Borders',
    description:
      'Send and receive payments in real-time with just a few clicks.',
  },
  {
    image: require('../../assets/second.png'),
    title: 'Multi-Currency Wallets at Your Fingertips',
    description:
      'Hold and convert multiple currencies in one wallet. Say goodbye to hidden fees.',
  },
  {
    image: require('../../assets/third.png'),
    title: 'Verified Merchants',
    description:
      'Accept payments, manage your customers, and grow your business, all from your phone.',
  },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const slides = getSlides(t);
  const [page, setPage] = useState(0);
  const pagerRef = useRef<any>(null);

  const handleNext = () => {
    if (page < slides.length - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      pagerRef.current?.setPage(nextPage);
    }
  };

  const handleSkip = () => {
    const lastPage = slides.length - 1;
    setPage(lastPage);
    pagerRef.current?.setPage(lastPage);
  };

  const isLastPage = page === slides.length - 1;

  return (
    <ScreenContainer useSafeArea={true} className="bg-white" padding={0}>
      {!isLastPage && (
        <View className="absolute top-16 right-6 z-10">
          <Button
            variant="ghost"
            onPress={handleSkip}
            className="bg-transparent"
            textClassName="text-gray-500 text-base"
          >
            {t('skip')}
          </Button>
        </View>
      )}

      <View className="flex-1">
        <PagerViewWrapper
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e: any) => setPage(e.nativeEvent.position)}
        >
          {slides.map((slide, idx) => (
            <View
              key={idx}
              className="flex-1 items-center justify-center pt-20"
            >
              <OnboardingSlide image={slide.image} />

              <View className="items-center w-full px-6">
                <Typography
                  variant="h3"
                  className="text-center text-[22px] leading-tight text-gray-900 mb-4 w-full max-w-[280px]"
                >
                  {slide.title}
                </Typography>

                <Typography
                  variant="body"
                  color="gray"
                  className="text-center text-gray-300 text-base w-full max-w-[300px] mb-8 leading-relaxed"
                >
                  {slide.description}
                </Typography>
              </View>
            </View>
          ))}
        </PagerViewWrapper>

        <View className="pb-12 px-6 items-center">
          <View className="flex-row gap-1 justify-center items-center mb-10">
            {slides.map((_, i) => {
              const isActive = page === i;
              return (
                <View
                  key={i}
                  className={twMerge(
                    isActive ? 'w-[16px] h-[16px]' : 'w-[12px] h-[12px]',
                    'rounded-full justify-center items-center',
                    isActive ? 'bg-blue-700' : 'bg-gray-100'
                  )}
                >
                  <View
                    className={twMerge(
                      isActive ? 'w-[13px] h-[13px]' : 'w-[9px] h-[9px]',
                      'rounded-full',
                      isActive
                        ? 'bg-blue-700 border-[2px] border-white'
                        : 'bg-blue-500/20'
                    )}
                  />
                </View>
              );
            })}
          </View>

          <View className="w-full h-[120px] items-center">
            {isLastPage ? (
              <View className="w-full space-y-4 gap-4 items-center justify-end flex-1">
                <Link href={'/onboarding/register'} asChild>
                  <ReusableButton
                    variant="primary"
                    text={t('register')}
                    textColor="#fff"
                  />
                </Link>
                <Link href={'/auth/login'} asChild>
                  <ReusableButton
                    variant="outline"
                    text={t('login')}
                    textColor="#FF4040"
                    className="border-red-500"
                  />
                </Link>
              </View>
            ) : (
              <View className="w-full items-center justify-start pt-4">
                <ReusableButton
                  variant="primary"
                  text={t('next')}
                  showArrow={true}
                  onPress={handleNext}
                  textColor="#fff"
                  iconColor="#fff"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
