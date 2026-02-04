import { SETUP_PIN_MUTATION, type SetupPaymentPinInput } from '@repo/api';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Keyboard } from 'iconsax-reactjs';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';

interface SetupPinActionProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const SetupPinAction = ({ onClose, onSuccess }: SetupPinActionProps) => {
  const [step, setStep] = useState<'intro' | 'create' | 'verify' | 'result'>('intro');
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [pinMatch, setPinMatch] = useState<'idle' | 'match' | 'mismatch'>('idle');
  const [shake, setShake] = useState(false);
  const [mutationResult, setMutationResult] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [setupPin, { loading }] = useMutation(SETUP_PIN_MUTATION, {
    onCompleted: (data) => {
      if (data.setupPaymentPin.success) {
        setMutationResult({
          status: 'success',
          message: data.setupPaymentPin.message || 'Payment PIN set up successfully!'
        });
        setStep('result');
      } else {
        setMutationResult({
          status: 'error',
          message: data.setupPaymentPin.message || 'Failed to set up PIN'
        });
        setStep('result');
      }
    },
    onError: (error) => {
      setMutationResult({
        status: 'error',
        message: error.message || 'An error occurred while setting up PIN'
      });
      setStep('result');
    }
  });

  useEffect(() => {
    if (step === 'verify' && confirmPin.every((digit) => digit !== '')) {
      const pinString = pin.join('');
      const confirmPinString = confirmPin.join('');

      if (pinString === confirmPinString) {
        setPinMatch('match');
      } else {
        setPinMatch('mismatch');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else {
      setPinMatch('idle');
    }
  }, [confirmPin, pin, step]);

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value.slice(-1);

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    if (value && index < 3) {
      inputRefs.current[index + 1 + (isConfirm ? 4 : 0)]?.focus();
    } else if (value && index === 3 && !isConfirm) {
      setStep('verify');
      setTimeout(() => inputRefs.current[4]?.focus(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isConfirm: boolean = false) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1 + (isConfirm ? 4 : 0)]?.focus();
    }
  };

  const handleContinueFromIntro = () => {
    setStep('create');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleSubmit = async () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    const input: SetupPaymentPinInput = {
      paymentPin: pinString,
      paymentPinConfirmation: confirmPinString
    };

    await setupPin({ variables: { input } });
  };

  const handleBack = () => {
    if (step === 'verify') {
      setConfirmPin(['', '', '', '']);
      setPinMatch('idle');
      setStep('create');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else if (step === 'create') {
      setPin(['', '', '', '']);
      setStep('intro');
    }
  };

  const handleResultAction = () => {
    if (mutationResult?.status === 'success') {
      onSuccess?.();
      onClose();
    } else {
      setStep('intro');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setPinMatch('idle');
      setMutationResult(null);
    }
  };

  const getInputClassName = (isVerify: boolean) => {
    const baseClass =
      'w-14 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200';

    if (!isVerify) {
      return `${baseClass} border-gray-300 focus:border-blue-500`;
    }

    if (pinMatch === 'match') {
      return `${baseClass} border-green-500 bg-green-50`;
    }

    if (pinMatch === 'mismatch') {
      return `${baseClass} border-red-500 bg-red-50 ${shake ? 'animate-shake' : ''}`;
    }

    return `${baseClass} border-gray-300 focus:border-blue-500`;
  };

  if (step === 'result' && mutationResult) {
    return (
      <ErrorAndSuccessFallback
        status={mutationResult.status}
        title={mutationResult.status === 'success' ? 'PIN Set Up Successfully' : 'PIN Setup Failed'}
        body={mutationResult.message}
        onAction={handleResultAction}
        buttonText={mutationResult.status === 'success' ? 'Done' : 'Try Again'}
      />
    );
  }

  if (step === 'intro') {
    return (
      <>
        <div className="flex items-center justify-center mb-4">
          <Keyboard size="50" color="#FF8A65" variant="Bulk" />
        </div>
        <h4 className="text-xl font-semibold text-center uppercase">Set Up Payment PIN</h4>
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-md text-gray-600">
            To secure your transactions, please set up a payment PIN. This PIN will be required for all payment
            operations.
          </p>
          <div className="flex gap-3 justify-end mt-2">
            <Button className="w-full bg-red-400/20" variant="outline" onClick={onClose}>
              Later
            </Button>
            <Button className="w-full" onClick={handleContinueFromIntro}>
              Continue
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (step === 'create') {
    return (
      <>
        <h4 className="text-xl font-semibold text-center uppercase">Create Your PIN</h4>
        <div className="flex flex-col gap-6 mt-6">
          <p className="text-md text-gray-600 text-center">Enter a 4-digit PIN</p>

          <div className="flex gap-3 justify-center">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={getInputClassName(false)}
              />
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <Button className="w-full" variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h4 className="text-xl font-semibold text-center uppercase">Verify Your PIN</h4>
      <div className="flex flex-col gap-6 mt-6">
        <p className="text-md text-gray-600 text-center">Re-enter your 4-digit PIN to confirm</p>

        <div className="flex gap-3 justify-center">
          {confirmPin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index + 4] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(index, e, true)}
              className={getInputClassName(true)}
            />
          ))}
        </div>

        {pinMatch === 'mismatch' && (
          <p className="text-sm text-red-500 text-center">PINs do not match. Please try again.</p>
        )}

        {pinMatch === 'match' && (
          <p className="text-sm text-green-600 text-center">✓ PINs match! Click Continue to proceed.</p>
        )}

        <div className="flex gap-3 mt-4">
          <Button className="w-full" variant="outline" onClick={handleBack} disabled={loading}>
            Back
          </Button>
          {pinMatch === 'match' && (
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Setting up...' : 'Continue'}
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </>
  );
};

export { SetupPinAction };
