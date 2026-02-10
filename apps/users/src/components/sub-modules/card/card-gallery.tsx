import PaymentCard from '@/components/sub-modules/card/e-card/debit';
import { Typography } from '@/components/sub-modules/typography/typography';
import { useDialog } from '@/hooks/use-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft2, ArrowRight2, Trash } from 'iconsax-reactjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, FormControl, FormField, FormItem } from 'k-polygon-assets';
import { CardRecord } from '@/utils/cards-storage';

import { ShowCardDetailsAuth } from './show-card-details-auth';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { transactionPinSchema } from '@/schema/dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { verifyCardPin } from '@/utils/cards-storage';
import { useForm } from 'react-hook-form';

interface CardGalleryProps {
  cards: CardRecord[];
  onDelete: (id: string) => void;
}

export const CardGallery = ({ cards, onDelete }: CardGalleryProps) => {
  const { t } = useTranslation();
  // Safe translation helper: always return a string; fall back when i18n returns the key or a non-string value
  const tr = (key: string, fallback: string, options?: Record<string, any>): string => {
    const val = options ? t(key, options) : t(key);
    if (typeof val !== 'string') return fallback;
    return val === key ? fallback : val;
  };
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [index, setIndex] = useState(0);
  const { close } = useDialog();

  const current = useMemo(() => cards[index] ?? null, [cards, index]);
  const hasCards = cards.length > 0;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Distinct gradients for each card
  const gradients = useMemo(
    () => [
      { from: 'from-purple-500', via: 'via-pink-500', to: 'to-red-500' },
      { from: 'from-blue-500', via: 'via-indigo-500', to: 'to-purple-500' },
      { from: 'from-emerald-500', via: 'via-teal-500', to: 'to-cyan-500' },
      { from: 'from-amber-500', via: 'via-orange-500', to: 'to-red-500' },
      { from: 'from-fuchsia-500', via: 'via-purple-500', to: 'to-indigo-500' }
    ],
    []
  );
  const gradientIdx = index % gradients.length;

  const pinSchema = transactionPinSchema();
  type PinFormValues = z.infer<typeof pinSchema>;
  const pinForm = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: '' },
    mode: 'onChange'
  });

  const next = () => {
    if (!hasCards) return;
    setShowCardDetails(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    if (!hasCards) return;
    setShowCardDetails(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <>
      <motion.div
        className="bg-white py-[15px] rounded-[10px] px-[54px] flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={prev}
          className="disabled:opacity-40"
          disabled={!hasCards}
          aria-label="Previous card"
        >
          <ArrowLeft2 size={24} />
        </motion.button>

        <div className="flex gap-[32px] items-center">
          <motion.div
            className="flex flex-col gap-y-[16px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
              transition={{ duration: 0.3 }}
            >
              <PaymentCard
                holderName={
                  current?.holderName || `${tr('placeholders.firstName', 'John')} ${tr('placeholders.lastName', 'Doe')}`
                }
                isEnabled={false}
                width="w-80"
                height="h-[179px]"
                gradientFrom={gradients[gradientIdx].from}
                gradientVia={gradients[gradientIdx].via}
                gradientTo={gradients[gradientIdx].to}
                className="transition-all duration-300 shadow-none"
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ShowCardDetailsAuth
                onSubmit={() => {
                  setShowCardDetails(true);
                  close();
                }}
                onReset={() => {
                  setShowCardDetails(false);
                }}
                showCardDetails={showCardDetails}
              />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showCardDetails && current && (
              <motion.div
                className="flex flex-col justify-between h-full py-2 gap-y-[11px]"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
              >
                <motion.div
                  className="space-y-[7px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Typography className="font-bold">{tr('dashboard.card.cardNumber', 'Card Number')}</Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography>{current.cardNumber}</Typography>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-[7px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Typography className="font-bold">{tr('dashboard.card.expiryDate', 'Expiry Date')}</Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Typography>{current.expiryDate}</Typography>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-[7px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Typography className="font-bold">{tr('dashboard.card.cvv', 'CVV')}</Typography>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Typography>{current.CVV}</Typography>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="pt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <Button
                    variant="destructive"
                    className="h-[36px] rounded-[10px] !py-0 bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash size={16} className="mr-2" /> {tr('dashboard.card.deleteCard', 'Delete Card')}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={next}
          className="disabled:opacity-40"
          disabled={!hasCards}
          aria-label="Next card"
        >
          <ArrowRight2 size={24} />
        </motion.button>
      </motion.div>

      {/* Rectangle pagination indicator under the slider */}
      {cards.length > 1 && (
        <motion.div
          className="flex justify-center items-center gap-2 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-label="Card slider pagination"
        >
          <span className="sr-only">{`Slide ${index + 1} of ${cards.length}`}</span>
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setShowCardDetails(false);
                setIndex(i);
              }}
              className="focus:outline-none"
              aria-label={`Go to slide ${i + 1}`}
            >
              <motion.div
                className="h-[4px] rounded-full"
                animate={{
                  width: i === index ? 24 : 12,
                  backgroundColor: i === index ? '#111827' : '#D1D5DB',
                  opacity: i === index ? 1 : 0.7
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
          ))}
        </motion.div>
      )}

      <DefaultModal
        trigger={<span className="hidden" />}
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        className="max-w-[500px]"
        canExit
      >
        <div className="space-y-4 text-center">
          <Typography variant="h3">{tr('dashboard.card.areYouSure', 'Are you sure?')}</Typography>
          <Typography>
            {tr(
              'dashboard.card.deleteCardConfirmMessage',
              `Do you really want to delete this card${current?.holderName ? ` (${current.holderName})` : ''}? This action cannot be undone.`,
              { holderName: current?.holderName ? ` (${current.holderName})` : '' }
            )}
          </Typography>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              className="h-[36px] rounded-[10px] !py-0 bg-gray-200 text-gray-900 hover:bg-gray-300"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              {tr('common.cancel', 'Cancel')}
            </Button>
            <Button
              className="h-[36px] rounded-[10px] !py-0 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setPinOpen(true);
                setError(null);
                pinForm.reset({ pin: '' });
              }}
            >
              {tr('common.proceed', 'Proceed')}
            </Button>
          </div>
        </div>
      </DefaultModal>

      <DefaultModal trigger={<span className="hidden" />} open={pinOpen} onClose={() => setPinOpen(false)} canExit>
        <Form {...pinForm}>
          <form
            onSubmit={pinForm.handleSubmit((values) => {
              if (!current) return;
              const verified = verifyCardPin(current.id, values.pin);
              if (verified) {
                setPinOpen(false);
                onDelete(current.id);
              } else {
                setError('Incorrect PIN. Please try again.');
              }
            })}
            className="space-y-4 mt-[8px] mb-[8px] text-center flex flex-col items-center"
          >
            <Typography variant="h3">{tr('dashboard.card.enterPin', 'Enter PIN')}</Typography>
            <FormField
              control={pinForm.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center flex-col">
                  <FormControl>
                    <div className="relative">
                      <InputOTP maxLength={4} value={field.value} onChange={field.onChange}>
                        <InputOTPGroup className="gap-3">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <InputOTPSlot
                              className={`border !rounded-lg size-[46px] ${pinForm.formState.errors.pin || error ? 'border-red-500' : ''}`}
                              key={index}
                              index={index}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <CustomFormMessage message={pinForm.formState.errors.pin} scope="error" />
                  {error && (
                    <Typography className="text-red-600 text-sm mt-2">
                      {tr('dashboard.card.pinIncorrect', 'Incorrect PIN. Please try again.')}
                    </Typography>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              <Button
                type="button"
                className="h-[36px] rounded-[10px] !py-0 bg-gray-200 text-gray-900 hover:bg-gray-300"
                onClick={() => setPinOpen(false)}
              >
                {tr('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                className="h-[36px] rounded-[10px] !py-0 bg-primary hover:bg-brandBlue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {tr('common.confirm', 'Confirm')}
              </Button>
            </div>
          </form>
        </Form>
      </DefaultModal>
    </>
  );
};
