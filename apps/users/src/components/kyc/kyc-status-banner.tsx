import React from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, ArrowRight, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '@repo/ui';
import { useKycStatus } from '../../hooks/api/use-kyc-status';

interface KycStatusBannerProps {
  className?: string;
}

const KycStatusBanner: React.FC<KycStatusBannerProps> = ({ className }) => {
  const kycStatus = useKycStatus();

  if (kycStatus.loading || kycStatus.isComplete) {
    return null;
  }

  const getIcon = () => {
    switch (kycStatus.variant) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = () => {
    return kycStatus?.status === 'incomplete' ? 'destructive' : 'default';
  };

  return (
    <Alert variant={getAlertVariant()} className={className}>
      {getIcon()}
      <div className="flex w-full items-center justify-between">
        <div>
          <AlertTitle className="font-medium">Account Verification</AlertTitle>
          <AlertDescription>{kycStatus.message}</AlertDescription>
        </div>
        {kycStatus.actionText && (
          <Link to={kycStatus.redirectUrl}>
            <Button data-tour="start-verification-btn" variant={'disabled_outline'}>
              {kycStatus.actionText}
              <ArrowRight />
            </Button>
          </Link>
        )}
      </div>
    </Alert>
  );
};

export default KycStatusBanner;
