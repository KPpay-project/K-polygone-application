import { Typography } from '@/components/ui';
import { Button } from '@/components/ui/button/button';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { ArrowRight } from 'iconsax-react-nativejs';
import { twMerge } from 'tailwind-merge';

interface IOnboardContent {
  title: string;
  description: string;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonClassName?: string;
  showButtons?: boolean;
  onRegister?: () => void;
  onLogin?: () => void;
  slides: any[];
  page: number;
}

export function OnboardContent({
  title,
  description,
  buttonText,
  onButtonPress,
  buttonClassName,
  showButtons = false,
  onRegister,
  onLogin,
  slides,
  page,
}: IOnboardContent) {
  return (
    <View className="items-center w-full px-6">
      <Typography
        variant="h3"
        className="f text-center text-[22px] leading-tight text-gray-900 mb-4 w-full max-w-[280px]"
      >
        {title}
      </Typography>

      <Typography
        variant="body"
        color="gray"
        className="text-center text-gray-300 text-base w-full max-w-[300px] mb-8 leading-relaxed"
      >
        {description}
      </Typography>

      <View className="flex-row gap-1 justify-center items-center mt-2 mb-10">
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

      {showButtons ? (
        <View className="w-full space-y-4 gap-4">
          <Link href={'/onboarding/register'}>
            <Button
              variant="primary"
              onPress={onButtonPress}
              className="bg-primary-DEFAULT w-[324px]"
            >
              Register
            </Button>
          </Link>
          <Link href={'/onboarding/login'}>
            <Button
              variant="outline"
              onPress={onButtonPress}
              className="bg-primary-DEFAULT w-[324px]"
            >
              Login
            </Button>
          </Link>
        </View>
      ) : (
        buttonText && (
          <Button
            variant="primary"
            onPress={onButtonPress}
            className="bg-primary-DEFAULT
             w-[324px]"
          >
            {' '}
            <View className=" flex-row text-white gap-2 align-center items-center justify-center">
              <Typography color="#fff">Next</Typography>
              <ArrowRight color="#fff" size={18} />
            </View>
          </Button>
        )
      )}
    </View>
  );
}
