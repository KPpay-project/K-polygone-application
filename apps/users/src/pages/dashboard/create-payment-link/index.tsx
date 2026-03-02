//@ts-nocheck
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PROVIDER_LABELS } from '@/constant';
import { Lock, Wallet, CreditCard, Landmark, ChevronLeft, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultModal from '@/components/sub-modules/popups/modal';
import CreditCardInput from 'react-credit-card-input';
import { toast } from 'sonner';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';

// Mock Banks List
const BANKS = {
  // 'access_bank': 'Access Bank',
  // 'gtbank': 'Guaranty Trust Bank',
  // 'zenith_bank': 'Zenith Bank',
  // 'uba': 'United Bank for Africa',
  // 'kpay_bank': 'K-Pay Bank'
};

const SOURCE_PROVIDERS = [
  { id: 'card', name: 'Pay with Card', icon: CreditCard, type: 'card' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: Landmark, type: 'bank' },
  ...Object.entries(PROVIDER_LABELS).map(([key, label]) => ({
    id: key,
    name: label,
    icon: Wallet,
    type: 'mno'
  }))
];

const TARGET_PROVIDERS = [
  ...Object.entries(PROVIDER_LABELS).map(([key, label]) => ({
    id: key,
    name: label,
    icon: Wallet,
    type: 'mno'
  })),
  // Add specific banks instead of generic "Bank Account"
  ...Object.entries(BANKS).map(([key, label]) => ({
    id: key,
    name: label,
    icon: Landmark,
    type: 'bank'
  }))
];

type Step = 'SUMMARY' | 'PAYMENT_DETAILS' | 'SUCCESS' | 'ERROR';

const CrossPaymentPage = () => {
  const [amount, setAmount] = useState('1000');
  const [sourceProvider, setSourceProvider] = useState(SOURCE_PROVIDERS[0]?.id || '');
  const [targetProvider, setTargetProvider] = useState(TARGET_PROVIDERS[0]?.id || '');
  const [recipientId, setRecipientId] = useState(''); // MNO Phone or Bank Account Number

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<Step>('SUMMARY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'success' | 'error'>('success');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [senderId, setSenderId] = useState('');

  const exchangeRate = 1.175;
  const fees = 6.21;
  const recipientAmount = ((parseFloat(amount || '0') - fees) * exchangeRate).toFixed(2);
  const totalFees = fees.toFixed(2);

  const getSourceProviderName = (id: string) => SOURCE_PROVIDERS.find((p) => p.id === id)?.name || id;
  const getTargetProviderName = (id: string) => TARGET_PROVIDERS.find((p) => p.id === id)?.name || id;
  // const getTargetType = (id: string) => TARGET_PROVIDERS.find((p) => p.id === id)?.type || 'mno';

  const handlePayNow = () => {
    setModalStep('SUMMARY');
    setIsModalOpen(true);
  };

  const handleConfirmSummary = () => {
    setModalStep('PAYMENT_DETAILS');
  };

  const handleFinalPayment = async () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionStatus('success');
      setModalStep('SUCCESS');
      // setIsModalOpen(false); // Keep open to show result
      // toast.success("Payment initiated successfully!");
    }, 2000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalStep === 'SUCCESS') {
      // Reset form or redirect if needed
    }
  };

  const isMNO = (providerId: string) => Object.keys(PROVIDER_LABELS).includes(providerId);
  const isBank = (providerId: string) => Object.keys(BANKS).includes(providerId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8 px-4">
        <Card className="w-full max-w-[480px] shadow-sm border border-gray-200 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="text-center mb-6">
              <span className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                1 {getSourceProviderName(sourceProvider)} = {exchangeRate} {getTargetProviderName(targetProvider)}
              </span>
            </div>

            <div className="relative">
              <div className="border border-gray-300 rounded-xl p-3 hover:border-gray-400 transition-colors bg-white z-10 relative">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-gray-500 font-normal">You send exactly</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-0 p-0 text-2xl font-bold shadow-none focus-visible:ring-0 h-auto"
                  />
                  <div className="flex-shrink-0">
                    <ProviderSelector value={sourceProvider} onChange={setSourceProvider} options={SOURCE_PROVIDERS} />
                  </div>
                </div>
              </div>

              <div className="absolute left-8 -bottom-4 w-[2px] h-8 bg-gray-200 z-0"></div>
            </div>

            <div className="pl-8 py-2 space-y-3 relative">
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gray-200 -z-10"></div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3 bg-white pl-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                    -
                  </span>
                  <span className="text-gray-600 font-medium">0 {getSourceProviderName(sourceProvider)}</span>
                </div>
                <span className="text-gray-500">Bank transfer fee</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3 bg-white pl-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                    -
                  </span>
                  <span className="text-gray-600 font-medium">
                    {totalFees} {getSourceProviderName(sourceProvider)}
                  </span>
                </div>
                <span className="text-gray-500">Our fee</span>
              </div>
            </div>

            <div className="relative space-y-3">
              <div className="border border-gray-300 rounded-xl p-3 hover:border-gray-400 transition-colors bg-white z-10 relative">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-gray-500 font-normal">Recipient gets</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={recipientAmount}
                    className="border-0 p-0 text-2xl font-bold shadow-none focus-visible:ring-0 h-auto bg-transparent text-gray-500"
                  />
                  <div className="flex-shrink-0">
                    <ProviderSelector value={targetProvider} onChange={setTargetProvider} options={TARGET_PROVIDERS} />
                  </div>
                </div>
              </div>

              {isMNO(targetProvider) && (
                <div className="border border-gray-300 rounded-xl p-3 hover:border-gray-400 transition-colors bg-white">
                  <Label className="text-gray-500 text-xs font-normal mb-1 block">Provider Number/ID</Label>
                  <Input
                    placeholder="e.g. 8134044405"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="border-0 p-0 text-base font-medium shadow-none focus-visible:ring-0 h-auto"
                  />
                </div>
              )}

              {isBank(targetProvider) && (
                <div className="border border-gray-300 rounded-xl p-3 hover:border-gray-400 transition-colors bg-white">
                  <Label className="text-gray-500 text-xs font-normal mb-1 block">Account Number</Label>
                  <Input
                    placeholder="10-digit Account Number"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="border-0 p-0 text-base font-medium shadow-none focus-visible:ring-0 h-auto"
                    maxLength={10}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePayNow}
                className="flex-1 rounded-full py-6 bg-blue-700 text-white hover:opacity-90 font-bold text-base"
              >
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <DefaultModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={modalStep === 'SUMMARY' ? 'Transaction Summary' : modalStep === 'PAYMENT_DETAILS' ? 'Make Payment' : ''}
        trigger={<></>}
        className="max-w-md w-full"
      >
        <div className="pt-2">
          {modalStep === 'SUCCESS' || modalStep === 'ERROR' ? (
            <ErrorAndSuccessFallback
              status={transactionStatus}
              title={transactionStatus === 'success' ? 'Payment Initiated' : 'Payment Failed'}
              body={
                transactionStatus === 'success'
                  ? `Your payment of ${amount} to ${recipientId || 'recipient'} has been successfully initiated.`
                  : 'There was an issue processing your payment. Please try again.'
              }
              onAction={handleCloseModal}
              buttonText={transactionStatus === 'success' ? 'Done' : 'Try Again'}
            />
          ) : modalStep === 'SUMMARY' ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">You Send</span>
                  <span className="font-semibold">
                    {amount} via {getSourceProviderName(sourceProvider)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipient Gets</span>
                  <span className="font-bold text-green-600">
                    {recipientAmount} via {getTargetProviderName(targetProvider)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fees</span>
                  <span className="font-medium">{totalFees}</span>
                </div>
                {(isMNO(targetProvider) || isBank(targetProvider)) && (
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-500">
                      {isBank(targetProvider) ? 'Account Number' : 'Recipient Number'}
                    </span>
                    <span className="font-medium">{recipientId}</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full rounded-full py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base mt-4"
                onClick={handleConfirmSummary}
              >
                Confirm Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setModalStep('SUMMARY')} className="-ml-2">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              </div>

              {sourceProvider === 'card' ? (
                <div className="space-y-4">
                  <Label>Enter Card Details to Pay {amount}</Label>
                  <div className="relative w-full">
                    <style>
                      {`
                                        .react-credit-card-input-container {
                                            width: 100% !important;
                                            max-width: 100% !important;
                                            height: 50px;
                                            border: 1px solid #e2e8f0;
                                            border-radius: 0.75rem;
                                            display: flex;
                                            align-items: center;
                                            padding: 0 0.75rem;
                                        }
                                         .react-credit-card-input-container:focus-within {
                                            border-color: #2563eb; 
                                            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
                                        }
                                        .react-credit-card-input {
                                            font-size: 1rem !important;
                                            color: #020817 !important;
                                            background: transparent !important;
                                        }
                                        .react-credit-card-input::placeholder {
                                            color: #94a3b8 !important;
                                        }
                                    `}
                    </style>
                    <CreditCardInput
                      cardNumberInputProps={{
                        value: cardNumber,
                        onChange: (e) => setCardNumber(e.target.value),
                        placeholder: '0000 0000 0000 0000'
                      }}
                      cardExpiryInputProps={{
                        value: expiry,
                        onChange: (e) => setExpiry(e.target.value),
                        placeholder: 'MM / YY'
                      }}
                      cardCVCInputProps={{ value: cvc, onChange: (e) => setCvc(e.target.value), placeholder: 'CVC' }}
                      fieldClassName="react-credit-card-input"
                      containerClassName="react-credit-card-input-container"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" /> Payments are secure and encrypted
                  </div>

                  <Button
                    className="w-full rounded-full py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base mt-4"
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing Payment...' : `Pay ${amount}`}
                  </Button>
                </div>
              ) : sourceProvider === 'bank_transfer' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                    <Label className="text-blue-800">Transfer exactly {amount} to:</Label>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100">
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="font-semibold text-gray-800">K-Pay Bank (Wema)</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100">
                        <div>
                          <p className="text-xs text-gray-500">Account Number</p>
                          <p className="font-semibold text-gray-800">9934201842</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard('9934201842')}>
                          <Copy className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100">
                        <div>
                          <p className="text-xs text-gray-500">Account Name</p>
                          <p className="font-semibold text-gray-800">K-Pay Mock Users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Use your unique Reference ID as the transaction description.
                  </p>

                  <Button
                    className="w-full rounded-full py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base mt-4"
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Verifying...' : 'I have made the transfer'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Enter your {getSourceProviderName(sourceProvider)} details</Label>
                  <Input
                    placeholder="Phone Number"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="h-12 rounded-xl text-lg"
                  />

                  <Button
                    className="w-full rounded-full py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base mt-4"
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing Payment...' : `Pay ${amount}`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DefaultModal>
    </DashboardLayout>
  );
};

interface ProviderOption {
  id: string;
  name: string;
  icon: any;
  type: string;
}

const ProviderSelector = ({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (val: string) => void;
  options: ProviderOption[];
}) => {
  const selected = options.find((p) => p.id === value);

  // const Icon = selected?.icon || Wallet;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-none shadow-none bg-transparent hover:bg-gray-100 rounded-full px-3 py-1 h-auto gap-2 w-auto focus:ring-0 max-w-[200px]">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-lg truncate">{selected?.name}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="end" className="w-[240px]">
        {options.map((provider) => (
          <SelectItem key={provider.id} value={provider.id}>
            <div className="flex items-center gap-3">
              <provider.icon className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col text-left">
                <span className="font-medium">{provider.name}</span>
              </div>
              {/* {value === provider.id && <Check className="w-4 h-4 ml-auto" />} */}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CrossPaymentPage;
