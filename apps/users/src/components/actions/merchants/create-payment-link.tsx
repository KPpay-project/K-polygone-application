import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { Download, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { PAYMENT_LINKS_QUERY, GENERATE_DEPOSIT_LINK } from '@repo/api';
import { useGetMyWallets } from '@/hooks/api/use-wallet-queries';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/sub-modules/typography/typography';
import {  DialogClose } from '@/components/ui/dialog';
import { InputWithSearch , CustomModal , Label, Input, Button , Checkbox } from '@ui/index';
import { Twitter, Facebook, Whatsapp } from 'react-social-sharing';


const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  walletId: z.string().min(1, 'Wallet is required'),
  type: z.enum(['one_time', 'reusable']),
  allowedChannels: z.array(z.string()).min(1, 'Select at least one channel')
});

type FormData = z.infer<typeof schema>;

const CHANNEL_OPTIONS = [
  { label: 'Mobile Money (MTN)', value: 'mtn_momo' },
  { label: 'Card', value: 'card' }
];

export const CreatePaymentLink = () => {
  const { refetch } = useQuery(PAYMENT_LINKS_QUERY);
  const qrRef = useRef<HTMLDivElement>(null);
  const [successData, setSuccessData] = useState<{
    checkoutUrl: string;
    code: string;
    name: string;
    amount: string;
    isActive: boolean;
    allowedChannels: string[];
    insertedAt: string;
  } | null>(null);

  const { data: walletsData, loading: walletsLoading } = useGetMyWallets();
  const [createPaymentLink, { loading: creating, error: mutationError }] = useMutation(GENERATE_DEPOSIT_LINK, {
    onCompleted: (data) => {
      if (data.createPaymentLink.success) {
        setSuccessData(data.createPaymentLink.paymentLink);
        toast.success('Payment link created successfully');
        refetch();
      } else {
        toast.error(data.createPaymentLink.message || 'Failed to create payment link');
      }
    },
    onError: () => {
      // Handled by Component error state or toast
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'one_time',
      allowedChannels: ['mtn_momo', 'card']
    }
  });

  const selectedWalletId = watch('walletId');
  const selectedWallet = walletsData?.myWallet?.find((w) => w.id === selectedWalletId);
  const currencyCode = selectedWallet?.currency?.code;

  const walletOptions = walletsData?.myWallet?.map((wallet) => ({
    label: `${wallet.currency.code} - ${parseFloat(wallet.balances[0]?.availableBalance || '0').toFixed(2)}`,
    value: wallet.id
  })) || [];

  const onSubmit = async (data: FormData) => {
    if (!currencyCode) return;

    await createPaymentLink({
      variables: {
        input: {
          ...data,
          currencyCode
        }
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownloadQr = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = `payment-link-${successData?.name || 'qr'}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download QR code', err);
        toast.error('Failed to download QR code');
      }
    }
  };

  if (mutationError) {
    return (
      <ErrorAndSuccessFallback
        status="error"
        title="Creation Failed"
        body={mutationError.message}
        buttonText="Try Again"
        onAction={() => window.location.reload()}
        hasButton={true}
      />
    );
  }

  return (
    <>

    
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border my-8">
        <div className="mb-6">
          <Typography variant="h2" className="text-2xl font-bold">
            Create Payment Link
          </Typography>
          <Typography className="text-gray-500">Generate a unique link to request payments.</Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Link Name</Label>
              <Input id="name" placeholder="e.g. Consultation Fee" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                className={cn(
                  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  errors.description && 'border-red-500 focus-visible:ring-red-500'
                )}
                placeholder="What is this payment for?"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wallet Selection */}
              <div className="space-y-2">
                <Label>Select Wallet</Label>
                <InputWithSearch
                  options={walletOptions}
                  value={selectedWalletId}
                  onChange={(val) => setValue('walletId', val)}
                  disabled={walletsLoading}
                  placeholder={walletsLoading ? 'Loading wallets...' : 'Select a wallet'}
                  searchPlaceholder="Search wallets..."
                  className={cn(errors.walletId && 'border-red-500')}
                />
                {errors.walletId && <p className="text-red-500 text-xs">{errors.walletId.message}</p>}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount {currencyCode ? `(${currencyCode})` : ''}</Label>
                <Input type="number" id="amount" step="0.01" placeholder="0.00" {...register('amount')} />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Link Type</Label>
              <InputWithSearch
                options={[
                  { label: 'One-time (Expires after one payment)', value: 'one_time' },
                  { label: 'Reusable (Multiple payments allowed)', value: 'reusable' }
                ]}
                value={watch('type')}
                onChange={(val) => setValue('type', val as 'one_time' | 'reusable')}
                placeholder="Select type"
                searchPlaceholder="Search type..."
              />
            </div>

            {/* Allowed Channels */}
            <div className="space-y-2">
              <Label>Allowed Payment Channels</Label>
              <div className="flex flex-wrap gap-4 pt-2">
                {CHANNEL_OPTIONS.map((channel) => (
                  <div key={channel.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.value}
                      defaultChecked={true}
                      onCheckedChange={(checked) => {
                        const current = watch('allowedChannels');
                        if (checked) {
                          setValue('allowedChannels', [...current, channel.value]);
                        } else {
                          setValue(
                            'allowedChannels',
                            current.filter((c) => c !== channel.value)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={channel.value} className="font-normal cursor-pointer">
                      {channel.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.allowedChannels && <p className="text-red-500 text-xs">{errors.allowedChannels.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={creating}>
            {creating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Link...
              </div>
            ) : (
              'Create Payment Link'
            )}
          </Button>
        </form>
      </div>

      {/* Success Modal */}
      <CustomModal
        open={!!successData}
        onOpenChange={(open) => {
          if (!open) {
            setSuccessData(null);
            reset();
          }
        }}
        contentClassName="p-0 overflow-hidden bg-white rounded-3xl border-0"
      >
          <div className="relative flex flex-col items-center">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-10 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors">
              <X size={20} className="text-red-500" />
            </DialogClose>

            <div className="pt-8 pb-4 px-6 text-center w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share QR Code Link</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Download, print, or share your payment link QR code with your customers to easily complete
              </p>

              <h3 className="text-lg font-bold text-blue-900/90 uppercase tracking-wide mb-6">
                SERVICE PRODUCT - {successData?.name}
              </h3>

              {/* Dark Card */}
              <div
                ref={qrRef}
                className="bg-[#1E2548] rounded-[2rem] p-8 w-full text-white 
                            flex flex-col items-center relative overflow-hidden"
              >
                <p className="text-lg font-medium mb-2">Scan here to pay</p>
                <div className="mb-6 animate-bounce">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 4V20M12 20L6 14M12 20L18 14"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="bg-white p-4 rounded-3xl mb-6">
                  <QRCode value={successData?.checkoutUrl || ''} size={150} />
                </div>

                {/* <p className="text-sm text-gray-300 mb-3">We accept:</p>
                                <div className="flex items-center justify-center gap-4 bg-white/10 py-3 px-6 rounded-full backdrop-blur-sm mb-8">
                                    <div className="bg-white rounded px-1 py-0.5"><FaApple className="text-black text-xl" /></div>
                                    <div className="bg-white rounded px-1 py-0.5"><FaGooglePay className="text-black text-xl" /></div>
                                    <div className="bg-white rounded px-1 py-0.5"><FaCcMastercard className="text-[#EB001B] text-xl" /></div>
                                    <div className="bg-white rounded px-1 py-0.5"><FaCcVisa className="text-[#1A1F71] text-xl" /></div>
                                </div> */}

                <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto">
                  <span>Powered by</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    {/* Using a placeholder logo or just text */}
                    <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    KPPAY
                  </span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-4 my-6">
                <Twitter link={successData?.checkoutUrl || ''} />
                <Facebook link={successData?.checkoutUrl || ''} />
                <Whatsapp link={successData?.checkoutUrl || ''} />
                {/* <Telegram link={successData?.checkoutUrl || ''} /> */}
                {/* <LinkedIn link={successData?.checkoutUrl || ''} /> */}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-gray-300 h-12"
                  onClick={() => copyToClipboard(successData?.checkoutUrl || '')}
                >
                  Copy link
                </Button>
                <Button
                  className="flex-1 rounded-full bg-red-200/50 hover:bg-red-200/80 text-red-600 font-medium h-12 gap-2"
                  onClick={handleDownloadQr}
                >
                  Download QR Code <Download size={18} />
                </Button>
              </div>
            </div>
          </div>
      </CustomModal>
    </>
  );
};

export default CreatePaymentLink;
