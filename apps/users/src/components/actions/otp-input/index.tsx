import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Keyboard } from 'iconsax-reactjs';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';

interface OtpInputActionProps {
  onClose: () => void;
  onSuccess?: () => void;
  onVerify: (otp: string) => Promise<{ success: boolean; message: string }>;
  title?: string;
  description?: string;
  otpLength?: number;
  skipIntro?: boolean;
}

const OtpInputAction = ({
  onClose,
  onSuccess,
  onVerify,
  title = 'Enter OTP',
  description = 'Enter the verification code sent to your phone',
  otpLength = 6,
  skipIntro = false
}: OtpInputActionProps) => {
  const [step, setStep] = useState<'intro' | 'enter' | 'result'>(skipIntro ? 'enter' : 'intro');
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mutationResult, setMutationResult] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // -------------------------------
  // Move from intro → enter
  // -------------------------------
  const handleContinueFromIntro = () => {
    setStep('enter');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  };

  // -------------------------------
  // Submit OTP
  // -------------------------------
  const handleSubmit = async () => {
    const otpString = otp.join('');

    if (otpString.length !== otpLength) return;

    setLoading(true);

    try {
      const result = await onVerify(otpString);

      if (result.success) {
        setMutationResult({ status: 'success', message: result.message || 'Verification successful!' });
        setStep('result');
      } else {
        setMutationResult({ status: 'error', message: result.message || 'Verification failed' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setStep('result');
      }
    } catch (error: any) {
      setMutationResult({
        status: 'error',
        message: error?.message || 'An error occurred during verification'
      });
      setStep('result');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'enter') {
      setOtp(Array(otpLength).fill(''));
      setStep('intro');
    }
  };

  const handleResultAction = () => {
    if (mutationResult?.status === 'success') {
      onSuccess?.();
      onClose();
    } else {
      setStep('intro');
      setOtp(Array(otpLength).fill(''));
      setMutationResult(null);
    }
  };

  const getInputClassName = () => {
    const baseClass =
      'w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200';

    if (shake) {
      return `${baseClass} border-red-500 bg-red-50 animate-shake`;
    }

    return `${baseClass} border-gray-300 focus:border-blue-500`;
  };

  if (step === 'result' && mutationResult) {
    return (
      <ErrorAndSuccessFallback
        status={mutationResult.status}
        title={mutationResult.status === 'success' ? 'Verification Successful' : 'Verification Failed'}
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
        <h4 className="text-xl font-semibold text-center uppercase">{title}</h4>

        <div className="flex flex-col gap-4 mt-6">
          <p className="text-md text-gray-600 text-center">{description}</p>

          <div className="flex gap-3 justify-end mt-2">
            <Button className="w-full bg-red-400/20" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button className="w-full" onClick={handleContinueFromIntro}>
              Continue
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h4 className="text-xl font-semibold text-center uppercase">{title}</h4>

      <div className="flex flex-col gap-6 mt-6">
        <p className="text-md text-gray-600 text-center">Enter the {otpLength}-digit code</p>

        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={getInputClassName()}
              disabled={loading}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button className="w-full" variant="outline" onClick={handleBack} disabled={loading}>
            Back
          </Button>

          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={handleSubmit}
            disabled={loading || otp.some((d) => d === '')}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
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

export { OtpInputAction };
