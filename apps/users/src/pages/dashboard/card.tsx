import { AddCreditCardForm, CardGallery, CardIsEmpty, AddCardPinModal } from '@/components/sub-modules/card';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { CardRecord, addCard, getCards, removeCard } from '@/utils/cards-storage';
import { ArrowRight } from 'iconsax-reactjs';
import { Button } from 'k-polygon-assets';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CreditCardPage = () => {
  const { t } = useTranslation();
  // Tracks whether the last submission showed the success state
  const [cardAdded, setCardAdded] = useState(false);
  // Step control: show PIN creation step after form submit
  const [showPinStep, setShowPinStep] = useState(false);
  // Hold form values until PIN is provided
  const [pendingCard, setPendingCard] = useState<{
    holderName: string;
    cardNumber: string;
    expiryDate: string;
    CVV: string;
  } | null>(null);
  // Persisted cards list
  const [cards, setCards] = useState<CardRecord[]>([]);

  useEffect(() => {
    setCards(getCards());
  }, []);

  return (
    <div>
      <div className="flex items-center justify-end">
        <DefaultModal
          trigger={
            <Button
              className="mb-[11px] px-[40px] rounded-[10px] h-[42px]"
              onClick={() => {
                // Reset success state when opening the modal for a fresh add
                setCardAdded(false);
                setShowPinStep(false);
                setPendingCard(null);
              }}
            >
              {t('dashboard.card.addCard')} <ArrowRight />
            </Button>
          }
          canExit
        >
          {cardAdded ? (
            <BaseModal
              title={t('dashboard.card.cardAddedSuccessfully')}
              body={t('dashboard.card.cardAddedDescription')}
              onAction={() => {}}
            />
          ) : showPinStep && pendingCard ? (
            <AddCardPinModal
              onSubmit={(pin) => {
                const updated = addCard({
                  holderName: pendingCard.holderName,
                  cardNumber: pendingCard.cardNumber,
                  expiryDate: pendingCard.expiryDate,
                  CVV: pendingCard.CVV,
                  pin
                });
                setCards(updated);
                setCardAdded(true);
                setShowPinStep(false);
                setPendingCard(null);
              }}
              onCancel={() => {
                setShowPinStep(false);
              }}
            />
          ) : (
            <AddCreditCardForm
              onSubmit={(values) => {
                // Hold the card details and request PIN in a separate step
                setPendingCard({
                  holderName: values.holderName,
                  cardNumber: values.cardNumber,
                  expiryDate: values.expiryDate,
                  CVV: values.CVV
                });
                setShowPinStep(true);
              }}
            />
          )}
        </DefaultModal>
      </div>

      {cards.length > 0 ? (
        <CardGallery
          cards={cards}
          onDelete={(id) => {
            const updated = removeCard(id);
            setCards(updated);
          }}
        />
      ) : (
        <CardIsEmpty />
      )}
    </div>
  );
};

export default CreditCardPage;
