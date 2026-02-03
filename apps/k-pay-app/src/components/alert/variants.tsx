import React from 'react';
import { ErrorAlert } from './error-alert';

interface SuccessAlertProps {
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <ErrorAlert
      message={message}
      type="info"
      className={`bg-green-50 border-green-200 ${className}`}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
};

interface WarningAlertProps {
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const WarningAlert: React.FC<WarningAlertProps> = ({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}) => {
  return (
    <ErrorAlert
      message={message}
      type="warning"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
};

interface InfoAlertProps {
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const InfoAlert: React.FC<InfoAlertProps> = ({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}) => {
  return (
    <ErrorAlert
      message={message}
      type="info"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
};
