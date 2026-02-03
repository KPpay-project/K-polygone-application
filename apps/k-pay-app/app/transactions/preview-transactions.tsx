import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Typography } from '@/components/ui';
import { Copy, TickCircle } from 'iconsax-react-nativejs';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { HeaderWithTitle } from '@/components';
import { captureRef } from 'react-native-view-shot';
import { shareAsync } from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AppIcon = require('../../assets/icon.png');

interface TransactionData {
  id: string;
  name: string;
  amount: string;
  time: string;
  icon: string;
  type: 'expense' | 'income';
  status?: string;
  dateTime?: string;
  transactionType?: string;
  amountSent?: string;
  amountReceived?: string;
  referenceCode?: string;
  accountNumber?: string;
  accountName?: string;
  narration?: string;
}

interface DetailRowItem {
  label: string;
  value: string;
  copyable?: boolean;
  isStatus?: boolean;
}

const RowData = ({
  label,
  value,
  copyable,
  isStatus,
  isLast,
  onCopy,
}: DetailRowItem & {
  isLast: boolean;
  onCopy: (text: string, label: string) => void;
}) => {
  const getStatusStyle = (statusValue: string) => {
    const normalized = statusValue.toLowerCase();
    if (normalized === 'successful' || normalized === 'success') {
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '✓' };
    } else if (normalized === 'pending' || normalized === 'processing') {
      return { bg: 'bg-amber-50', text: 'text-amber-600', icon: '⏳' };
    }
    return { bg: 'bg-red-50', text: 'text-red-600', icon: '✕' };
  };

  const statusStyle = isStatus ? getStatusStyle(value) : null;

  return (
    <View
      className={`flex-row justify-between items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <Typography variant="caption" className="text-gray-400 text-[13px]">
        {label}
      </Typography>

      {isStatus && statusStyle ? (
        <View
          className={`${statusStyle.bg} px-3 py-1.5 rounded-full flex-row items-center`}
        >
          <Typography
            variant="small"
            className={`${statusStyle.text} font-semibold text-xs`}
          >
            {statusStyle.icon} {value}
          </Typography>
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Typography
            weight="600"
            variant="small"
            className="text-gray-800 text-[13px]"
            numberOfLines={2}
          >
            {value}
          </Typography>
          {copyable && (
            <TouchableOpacity
              onPress={() => onCopy(value, label)}
              className="p-1.5 bg-gray-50 rounded-full"
              activeOpacity={0.7}
            >
              <Copy size={14} color="#9CA3AF" variant="Outline" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default function PreviewTransactions() {
  const params = useLocalSearchParams();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const viewRef = useRef<View>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (params.data && typeof params.data === 'string') {
      try {
        const decodedData = JSON.parse(decodeURIComponent(params.data));
        setTransaction(decodedData);

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error('Error parsing transaction data:', error);
      }
    }
  }, [params.data]);

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: `${label} copied to clipboard`,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleShareReceipt = async () => {
    try {
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        await shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Transaction Receipt',
          UTI: 'public.png',
        });
      }
    } catch (error) {
      console.error('Error sharing receipt:', error);
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: 'Could not share receipt',
      });
    }
  };

  if (!transaction) return null;

  const getStatusConfig = (status: string = 'successful') => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'successful' || normalizedStatus === 'success') {
      return {
        icon: '✓',
        bgColor: 'bg-green-500',
        lightBgColor: 'bg-green-50',
        ringColor: 'border-green-200',
      };
    } else if (
      normalizedStatus === 'pending' ||
      normalizedStatus === 'processing'
    ) {
      return {
        icon: '⏱',
        bgColor: 'bg-yellow-500',
        lightBgColor: 'bg-yellow-50',
        ringColor: 'border-yellow-200',
      };
    } else {
      return {
        icon: '✕',
        bgColor: 'bg-red-500',
        lightBgColor: 'bg-red-50',
        ringColor: 'border-red-200',
      };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);

  const detailRows: DetailRowItem[] = [
    {
      label: 'Date & Time',
      value: transaction.time || transaction.dateTime || 'N/A',
    },
    {
      label: 'Amount Sent',
      value: transaction.amount || transaction.amountSent || 'N/A',
    },
    {
      label: 'Amount Received',
      value: transaction.amount || transaction.amountReceived || 'N/A',
    },
    {
      label: 'Account Number',
      value: transaction.accountNumber || 'N/A',
      copyable: true,
    },
    {
      label: 'Account Name',
      value: transaction.name || transaction.accountName || 'N/A',
    },
    {
      label: 'Narration',
      value: transaction.narration || 'No narration provided',
    },
    {
      label: 'Status',
      value: transaction.status || 'Successful',
      isStatus: true,
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        bounces={true}
        nestedScrollEnabled={true}
      >
        <View className="px-4 pt-4 pb-8">
          <HeaderWithTitle title="Transaction Receipt" />

          <Animated.View
            ref={viewRef}
            collapsable={false}
            style={{ opacity: fadeAnim }}
            className="bg-white rounded-3xl mt-4 overflow-hidden"
          >
            <View className="bg-[#0066ff] px-5 py-4">
              <View className="flex-row justify-between items-center">
                <View className="bg-white/20 p-2 rounded-xl">
                  <Image
                    source={AppIcon}
                    style={{ width: 32, height: 32, borderRadius: 8 }}
                    resizeMode="contain"
                  />
                </View>

                <View className="bg-white/20 px-4 py-2 rounded-full">
                  <Typography
                    variant="small"
                    className="text-white capitalize font-semibold text-xs"
                  >
                    {transaction.type}
                  </Typography>
                </View>
              </View>
            </View>

            {/* Amount Section */}
            <View className="items-center py-8 bg-gradient-to-b from-gray-50 to-white">
              <Animated.View
                style={{ transform: [{ scale: scaleAnim }] }}
                className={`w-20 h-20 ${statusConfig.lightBgColor} rounded-full items-center justify-center mb-5 border-4 ${statusConfig.ringColor}`}
              >
                <View
                  className={`w-14 h-14 ${statusConfig.bgColor} rounded-full items-center justify-center`}
                >
                  <Typography
                    variant="h2"
                    className="text-white font-bold text-2xl"
                  >
                    {statusConfig.icon}
                  </Typography>
                </View>
              </Animated.View>

              <Typography
                variant="caption"
                className="text-gray-400 mb-2 uppercase tracking-widest text-[10px]"
              >
                Transaction Amount
              </Typography>
              <Typography
                variant="h1"
                className="text-gray-900 font-bold text-4xl tracking-tight"
              >
                {transaction.amount}
              </Typography>
            </View>

            {/* Dotted Separator */}
            <View className="flex-row items-center px-4">
              <View className="w-4 h-8 bg-gray-100 rounded-r-full -ml-4" />
              <View className="flex-1 border-t-2 border-dashed border-gray-200" />
              <View className="w-4 h-8 bg-gray-100 rounded-l-full -mr-4" />
            </View>

            {/* Receipt Details */}
            <View className="px-5 py-5">
              <Typography
                variant="small"
                className="text-gray-400 font-bold mb-3 uppercase tracking-wider text-[10px]"
              >
                Transaction Details
              </Typography>

              <View className="bg-gray-50 rounded-2xl px-4">
                {detailRows.map((row, index) => (
                  <RowData
                    key={index}
                    {...row}
                    isLast={index === detailRows.length - 1}
                    onCopy={copyToClipboard}
                  />
                ))}
              </View>

              {/* QR Code Section */}
              {transaction.id && (
                <View className="mt-6 items-center">
                  <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <QRCode
                      value={transaction.id}
                      size={100}
                      backgroundColor="white"
                      color="#1F2937"
                    />
                  </View>
                  <View className="flex-row items-center gap-2 mt-3">
                    <Typography
                      variant="caption"
                      className="text-gray-400 text-xs"
                    >
                      Ref: {transaction.id.slice(0, 12)}...
                    </Typography>
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(transaction.id, 'Transaction ID')
                      }
                      className="p-1.5 bg-gray-100 rounded-full"
                      activeOpacity={0.7}
                    >
                      <Copy size={12} color="#9CA3AF" variant="Outline" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Receipt Footer */}
            <View className="bg-emerald-50 px-5 py-4 border-t border-emerald-100">
              <View className="flex-row items-center justify-center">
                <TickCircle size={16} color="#10B981" variant="Bold" />
                <Typography
                  variant="caption"
                  className="text-emerald-600 ml-2 text-xs font-medium"
                >
                  Official KPay Transaction Receipt
                </Typography>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View className="mt-6 gap-3">
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 bg-[#FF0033] rounded-2xl"
              onPress={handleShareReceipt}
              activeOpacity={0.8}
            >
              <Typography className="text-white font-semibold text-base">
                Share Receipt
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center py-4 bg-white rounded-2xl border border-gray-200"
              activeOpacity={0.7}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Report Transaction',
                  text2: 'Report functionality coming soon',
                  visibilityTime: 2000,
                  autoHide: true,
                });
              }}
            >
              <Typography
                variant="body"
                className="text-gray-600 font-semibold"
              >
                Report an Issue
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </View>
  );
}
