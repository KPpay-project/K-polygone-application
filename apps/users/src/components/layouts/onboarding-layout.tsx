import { motion } from 'framer-motion';
import { cn } from 'k-polygon-assets';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/store/user-store';
import { BackButton } from '../back-button';
import { Footer } from '../modules/footer';
import DefaultGlobalLoader from '../loaders/default-page-loader';
import { Typography } from '@repo/ui';

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
  const { checkSession, invalidate } = useAuth();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      invalidate();
      setIsChecking(false);
    }, 5000);

    const isSessionValid = checkSession();
    const isAuthenticated = isSessionValid && user;

    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
      return () => clearTimeout(timeoutId);
    }

    setIsChecking(false);
    clearTimeout(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [user, navigate, checkSession, invalidate]);

  if (isChecking) {
    return <DefaultGlobalLoader />;
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
    
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <motion.div
          className={cn(
            className,
            'flex-1 flex flex-col bg-white',
            'px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12',
            'h-full overflow-hidden'
          )}
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="w-full xl:w-[55%] max-w-sm sm:max-w-md 
          lg:max-w-lg xl:max-w-md mx-auto flex flex-col h-full">
            <motion.div
              className="mb-6 mt-8 sm:mt-12  lg:mt-4 xl:mt-2 flex-shrink-0"
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


              <Typography variant={"h3"}>
                {title}
              </Typography>

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
          className="hidden lg:flex lg:flex-1 xl:max-w-2xl bg-primary
           text-white items-center justify-center px-6 xl:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center max-w-md xl:max-w-lg flex flex-col items-center">
            <div className="mb-6 w-[90%]">
              <h3 className="text-xl xl:text-xl font-semibold leading-tight">{t('onboarding.sidebar.title')}</h3>
              <p className="mt-3 xl:mt-4 font-medium text-white/80 text-base
               xl:text-md mb-6 xl:mb-8 leading-relaxed">
                {t('onboarding.sidebar.subtitle')}
              </p>
            </div>

            <motion.div
              className="w-[85%] max-w-[400px] xl:max-w-[500px] aspect-[500/355] bg-black rounded-lg xl:rounded-[10px] bg-center bg-no-repeat bg-contain"
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
