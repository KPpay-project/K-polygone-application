import { router } from 'expo-router';
import SetupPinAction from '@/components/actions/create-pin-action';

const SetUpPinScreen = () => {
  const handleClose = () => {
    // Navigate to home when user cancels or closes
    router.replace('/(tabs)/home');
  };

  const handleSuccess = () => {
    // Navigate to home after successful PIN setup
    router.replace('/(tabs)/home');
  };

  return <SetupPinAction onClose={handleClose} onSuccess={handleSuccess} />;
};

export default SetUpPinScreen;
