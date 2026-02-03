import { motion } from 'framer-motion';
import { cn } from 'k-polygon-assets';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '@/store/user-store';
import { JWT_TOKEN_NAME } from '@/constant';
import { BackButton } from '../back-button';
import { Footer } from '../modules/footer';

interface IProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canGoBack?: boolean;
  className?: string;
  icon?: ReactNode;
}

const OnboardingLayout: FC<IProps> = ({ children, description, title, canGoBack, icon, className }) => {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(true);
  const user = useUser();
  const navigate = useNavigate();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  useEffect(() => {
    const token = getCookie(JWT_TOKEN_NAME);
    const isAuthenticated = token && user;

    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
      return;
    }

    setIsChecking(false);
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <motion.div
          className={cn(
            className,
            'flex-1 flex flex-col',
            'px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12',
            'h-full overflow-hidden'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto flex flex-col h-full">
            <motion.div
              className="mb-6 mt-8 sm:mt-12 lg:mt-16 xl:mt-20 flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {canGoBack && <BackButton />}

              {icon && (
                <motion.div
                  className="flex mb-6 sm:mb-8"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-3 sm:p-4 md:p-[18px] bg-[#F3F4F6] rounded-full">{icon}</div>
                </motion.div>
              )}

              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl leading-tight">
                {title}
              </h1>

              {description && (
                <motion.p
                  className="text-sm sm:text-base lg:text-sm text-[#161414]/60 mt-2 sm:mt-3 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {description}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              className="flex-1 overflow-y-auto pb-6 sm:pb-8 min-h-0 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:flex lg:flex-1 xl:max-w-2xl bg-primary text-white items-center justify-center px-6 xl:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center max-w-md xl:max-w-lg flex flex-col items-center">
            <div className="mb-6 w-full">
              <h1 className="text-xl xl:text-2xl font-semibold leading-tight">{t('onboarding.sidebar.title')}</h1>
              <p className="mt-3 xl:mt-4 font-medium text-white/80 text-base xl:text-lg mb-6 xl:mb-8 leading-relaxed">
                {t('onboarding.sidebar.subtitle')}
              </p>
            </div>

            <motion.div
              className="w-full max-w-[400px] xl:max-w-[500px] aspect-[500/355] bg-black rounded-lg xl:rounded-[10px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: 'url(/onboarding_image.svg)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default OnboardingLayout;
