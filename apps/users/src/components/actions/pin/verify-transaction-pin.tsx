import { Button } from '@repo/ui';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, SecuritySafe } from 'iconsax-reactjs';
import { IoBackspaceOutline } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface VerifyTransactionPinProps {
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

const KEYPAD_TAP = 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAACAgICAgICAg==';

const VerifyTransactionPin = ({
  onClose,
  onSuccess,
  title = 'Verify Transaction PIN',
  description = 'Enter your 4-digit PIN to authorize this transaction',
  loading = false
}: VerifyTransactionPinProps) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [shake, setShake] = useState(false);

  const [shuffledKeys, setShuffledKeys] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(KEYPAD_TAP);
    audioRef.current.volume = 0.25;
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    setPin(['', '', '', '']);
  }, []);

  useEffect(() => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    setShuffledKeys(digits);
  }, []);

  const handleKeyPress = (value: string) => {
    if (loading) return;

    playSound();
    const emptyIndex = pin.findIndex((digit) => digit === '');
    if (emptyIndex !== -1) {
      const newPin = [...pin];
      newPin[emptyIndex] = value;
      setPin(newPin);
    }
  };

  const handleDelete = () => {
    if (loading) return;

    playSound();
    const lastFilledIndex = pin.findLastIndex((digit) => digit !== '');
    if (lastFilledIndex !== -1) {
      const newPin = [...pin];
      newPin[lastFilledIndex] = '';
      setPin(newPin);
    }
  };

  const handleSubmit = () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSuccess(pinString);
  };

  const isPinComplete = pin.every((digit) => digit !== '');

  if (shuffledKeys.length === 0) return null;

  const keypadNumbers = [
    shuffledKeys.slice(0, 3),
    shuffledKeys.slice(3, 6),
    shuffledKeys.slice(6, 9),
    ['', shuffledKeys[9], 'delete']
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-6">
         <Keyboard size="50" color="red" variant="Bulk"  />
        <h4 className="text-xl font-bold text-center text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 text-center mt-2 max-w-[80%] mx-auto">{description}</p>
      </div>

      {/* PIN Circles */}
      <div className="flex flex-col gap-8 mt-2">
        <div className={`flex gap-6 justify-center ${shake ? 'animate-shake' : ''}`}>
          {pin.map((digit, index) => (
            <div
              key={index}
              className={cn(
                'w-4 h-4 rounded-full border border-gray-300 transition-all duration-300',
                digit ? 'bg-blue-600 border-blue-600 scale-125 shadow-none' : 'bg-transparent'
              )}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-6 max-w-[300px] mx-auto">
          {keypadNumbers.map((row, rIdx) =>
            row.map((key, cIdx) => {
              if (key === '') {
                return <div key={`${rIdx}-${cIdx}`} className="h-16 w-16" />;
              }

              if (key === 'delete') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={handleDelete}
                    disabled={loading || pin.every((d) => d === '')}
                    className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all border border-gray-200 text-gray-600 disabled:opacity-30 shadow-none"
                  >
                    <IoBackspaceOutline size="24" />
                  </button>
                );
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleKeyPress(key)}
                  disabled={loading || isPinComplete}
                  className={cn(
                    'h-16 w-16 rounded-full text-2xl font-semibold flex items-center justify-center',
                    'bg-white border border-gray-200 shadow-none hover:bg-gray-100 active:scale-95 transition-all',
                    'disabled:opacity-40'
                  )}
                >
                  {key}
                </button>
              );
            })
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
           className='w-full'
            variant="disabled_outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className={cn(
              'w-full h-12 rounded-xl text-base font-medium transition-all',
              isPinComplete
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-300 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
            onClick={handleSubmit}
            disabled={!isPinComplete || loading}
          >
            {loading ? 'Verifying...' : 'Verify PIN'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </>
  );
};

export { VerifyTransactionPin };
