import React from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { ZodIssue } from 'zod';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import CustomTextInput from '@/components/input/custom-text-input';
import { useCreateIdentityDocument } from '@/hooks/api/use-create-identity-document';

export default function IdentityDocumentsVerificationScreen() {
  const router = useRouter();
  type FormValues = {
    documentType: string;
    documentNumber: string;
    dateOfIssue: string;
    expiryDate: string;
    issuingAuthority: string;
    identityDocument: any;
  };

  const {
    createIdentityDocument,
    loading: createIdentityDocumentLoading,
    error: createIdentityDocumentError,
    data: createIdentityDocumentData,
  } = useCreateIdentityDocument();

  const [validationErrors, setValidationErrors] = React.useState<
    ZodIssue[] | null
  >(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<
    string | null
  >(null);
  const [showDocumentTypePicker, setShowDocumentTypePicker] =
    React.useState(false);
  const [documentTypeSearchQuery, setDocumentTypeSearchQuery] =
    React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<{
    name: string;
    uri: string;
  } | null>(null);
  const errorTopRef = React.useRef<ScrollView>(null);

  const scrollToTopOfForm = () => {
    try {
      errorTopRef.current?.scrollTo({ y: 0, animated: true });
    } catch {
      errorTopRef.current?.scrollTo({ y: 0 });
    }
  };

  const documentTypes = [
    { label: 'NIN', value: 'nin' },
    { label: 'Passport', value: 'passport' },
    { label: "Driver's License", value: 'drivers_license' },
    { label: 'National ID', value: 'national_id' },
  ];

  const filteredDocumentTypes = React.useMemo(
    () =>
      documentTypes.filter((type) =>
        type.label.toLowerCase().includes(documentTypeSearchQuery.toLowerCase())
      ),
    [documentTypeSearchQuery]
  );

  const findDocumentTypeByValue = (value?: string) => {
    if (!value) return null;
    return documentTypes.find((type) => type.value === value) || null;
  };

  const getDocumentNumberPlaceholder = (documentType: string) => {
    switch (documentType) {
      case 'nin':
        return '12345678901';
      case 'passport':
        return 'A1234567';
      case 'drivers_license':
        return 'ABC12345678';
      case 'national_id':
        return '123456789012';
      default:
        return '344489918119';
    }
  };

  const getDocumentNumberHelperText = (documentType: string) => {
    switch (documentType) {
      case 'nin':
        return 'Enter exactly 11 digits';
      case 'passport':
        return 'Enter 1-2 letters followed by 6-8 digits (e.g., A1234567)';
      case 'drivers_license':
        return 'Enter 8-15 alphanumeric characters';
      case 'national_id':
        return 'Enter 9-12 digits';
      default:
        return 'Enter your document number';
    }
  };

  const formatDocumentNumber = (value: string, documentType: string) => {
    if (documentType === 'nin' || documentType === 'national_id') {
      return value.replace(/[^\d]/g, '');
    } else if (
      documentType === 'passport' ||
      documentType === 'drivers_license'
    ) {
      return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    }
    return value;
  };

  const form = useForm({
    defaultValues: {
      documentType: '',
      documentNumber: '',
      dateOfIssue: '',
      expiryDate: '',
      issuingAuthority: '',
      identityDocument: undefined,
    },
  });

  const watchDocumentType = form.watch('documentType');

  React.useEffect(() => {
    if (watchDocumentType) {
      form.setValue('documentNumber', '');
    }
  }, [watchDocumentType, form]);

  const pickDocument = async () => {
    Alert.alert(
      'Select Document',
      'File upload functionality will be implemented with proper file picker',
      [
        {
          text: 'Simulate Selection',
          onPress: () => {
            const mockFile = {
              name: 'identity_document.pdf',
              uri: 'mock://file',
            };
            setSelectedFile(mockFile);
            form.setValue('identityDocument', mockFile as any);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  async function onSubmit(values: any) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const errors: ZodIssue[] = [];

      if (!values.documentType)
        errors.push({
          path: ['documentType'],
          message: 'Document type is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.documentNumber)
        errors.push({
          path: ['documentNumber'],
          message: 'Document number is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.dateOfIssue)
        errors.push({
          path: ['dateOfIssue'],
          message: 'Date of issue is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.expiryDate)
        errors.push({
          path: ['expiryDate'],
          message: 'Expiry date is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.issuingAuthority)
        errors.push({
          path: ['issuingAuthority'],
          message: 'Issuing authority is required',
          code: 'custom',
        } as ZodIssue);
      if (!selectedFile)
        errors.push({
          path: ['identityDocument'],
          message: 'Identity document file is required',
          code: 'custom',
        } as ZodIssue);

      if (errors.length > 0) {
        setValidationErrors(errors);
        scrollToTopOfForm();
        return;
      }

      const input = {
        documentType: values.documentType,
        documentNumber: values.documentNumber.trim(),
        dateOfIssue: values.dateOfIssue,
        expiryDate: values.expiryDate,
        issuingAuthority: values.issuingAuthority.trim(),
        documentUrl: selectedFile?.uri || '',
      };

      const result = await createIdentityDocument({
        variables: { input },
      });

      const res = {
        ok: !result.errors && result.data?.createIdentityDocument?.success,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/financial-info');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createIdentityDocumentData?.createIdentityDocument;
  const bannerHasServerFieldErrors = !!(
    bannerPayload?.errors && bannerPayload.errors.length > 0
  );
  const bannerShouldShowServerMessage = !!(
    bannerPayload &&
    bannerPayload.message &&
    bannerPayload.success === false
  );
  const bannerShouldShow = !!(
    validationErrors ||
    createIdentityDocumentError ||
    bannerHasServerFieldErrors ||
    bannerShouldShowServerMessage ||
    wrapperErrorMessage
  );

  React.useEffect(() => {
    if (bannerShouldShow) {
      scrollToTopOfForm();
    }
  }, [bannerShouldShow]);

  const selectedDocumentType = findDocumentTypeByValue(
    form.watch('documentType')
  );

  return (
    <ScreenContainer useSafeArea={true}>
      <ScrollView
        ref={errorTopRef}
        className="flex-1 px-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithTitle title="Identity Document" />
        <Typography className="text-base text-gray-500 mb-6">
          Upload your identity document for verification
        </Typography>

        {bannerShouldShow && (
          <View className="bg-red-50 p-4 rounded-lg mb-4 border border-red-100">
            {validationErrors && (
              <View className="mb-2">
                {validationErrors.map((error: ZodIssue, index: number) => (
                  <Typography key={index} className="text-red-600 text-sm">
                    {`${error.path.join('.')}: ${error.message}`}
                  </Typography>
                ))}
              </View>
            )}
            {wrapperErrorMessage && (
              <Typography className="text-red-600 text-sm mb-2">
                {wrapperErrorMessage}
              </Typography>
            )}
            {createIdentityDocumentError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createIdentityDocumentError.message}
              </Typography>
            )}
            {bannerShouldShowServerMessage && (
              <Typography className="text-red-600 text-sm mb-2">
                {bannerPayload?.message}
              </Typography>
            )}
            {bannerHasServerFieldErrors && bannerPayload?.errors && (
              <View>
                {bannerPayload.errors.map((error: any, index: number) => (
                  <Typography key={index} className="text-red-600 text-sm">
                    {`${error.field}: ${error.message}`}
                  </Typography>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="space-y-4">
          <Controller
            control={form.control}
            name="identityDocument"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <View>
                <Typography className="text-sm font-medium mb-2 text-gray-900">
                  Upload Identity Document
                </Typography>
                <TouchableOpacity
                  onPress={pickDocument}
                  disabled={createIdentityDocumentLoading}
                  className={`w-full px-4 py-4 rounded-xl border ${
                    error ? 'border-red-500' : 'border-gray-200'
                  } ${
                    createIdentityDocumentLoading
                      ? 'opacity-50 bg-gray-50'
                      : 'bg-white'
                  }`}
                >
                  <Typography
                    className={`text-base ${
                      selectedFile ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {selectedFile
                      ? selectedFile.name
                      : 'Select file (PDF, JPG, PNG)'}
                  </Typography>
                </TouchableOpacity>
                <Typography className="text-xs text-gray-500 mt-1">
                  Accepted formats: JPG, PNG, PDF. Maximum size: 10MB
                </Typography>
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="documentType"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View className="relative">
                <Typography className="text-sm font-medium mb-2 text-gray-900">
                  Type of Document
                </Typography>
                <TouchableOpacity
                  className={`w-full px-4 py-4 rounded-xl border ${
                    error ? 'border-red-500' : 'border-gray-200'
                  } flex-row items-center justify-between ${
                    createIdentityDocumentLoading
                      ? 'opacity-50 bg-gray-50'
                      : 'bg-white'
                  }`}
                  onPress={() =>
                    !createIdentityDocumentLoading &&
                    setShowDocumentTypePicker(!showDocumentTypePicker)
                  }
                  disabled={createIdentityDocumentLoading}
                >
                  <Typography
                    className={`text-base ${
                      selectedDocumentType ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {selectedDocumentType?.label || 'Select document type'}
                  </Typography>
                  <Typography className="text-gray-400 text-xs">▼</Typography>
                </TouchableOpacity>

                {showDocumentTypePicker && (
                  <View className="absolute top-20 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60">
                    <View className="p-3 border-b border-gray-200">
                      <TextInput
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
                        placeholder="Search document type..."
                        placeholderTextColor="#9CA3AF"
                        value={documentTypeSearchQuery}
                        onChangeText={setDocumentTypeSearchQuery}
                      />
                    </View>
                    <ScrollView className="max-h-48">
                      {filteredDocumentTypes.map((type) => (
                        <TouchableOpacity
                          key={type.value}
                          className="px-4 py-3 border-b border-gray-100"
                          onPress={() => {
                            onChange(type.value);
                            setShowDocumentTypePicker(false);
                            setDocumentTypeSearchQuery('');
                          }}
                        >
                          <Typography className="text-gray-900 text-base">
                            {type.label}
                          </Typography>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="documentNumber"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Document Number"
                  placeholder={getDocumentNumberPlaceholder(watchDocumentType)}
                  value={value}
                  onChangeText={(text) => {
                    const formattedValue = formatDocumentNumber(
                      text,
                      watchDocumentType
                    );
                    onChange(formattedValue);
                  }}
                  editable={!createIdentityDocumentLoading}
                  hasError={!!error}
                />
                {!error && watchDocumentType && (
                  <Typography className="text-xs text-gray-500 mt-1">
                    {getDocumentNumberHelperText(watchDocumentType)}
                  </Typography>
                )}
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={form.control}
                name="dateOfIssue"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <CustomTextInput
                      label="Date of Issue"
                      placeholder="YYYY-MM-DD"
                      value={value}
                      onChangeText={onChange}
                      editable={!createIdentityDocumentLoading}
                      hasError={!!error}
                    />
                    {error && (
                      <Typography className="text-red-500 text-xs mt-1">
                        {error.message}
                      </Typography>
                    )}
                  </View>
                )}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={form.control}
                name="expiryDate"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <CustomTextInput
                      label="Expiry Date"
                      placeholder="YYYY-MM-DD"
                      value={value}
                      onChangeText={onChange}
                      editable={!createIdentityDocumentLoading}
                      hasError={!!error}
                    />
                    {error && (
                      <Typography className="text-red-500 text-xs mt-1">
                        {error.message}
                      </Typography>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <Controller
            control={form.control}
            name="issuingAuthority"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Issuing Authority"
                  placeholder="Lagos"
                  value={value}
                  onChangeText={onChange}
                  editable={!createIdentityDocumentLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            disabled={createIdentityDocumentLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createIdentityDocumentLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createIdentityDocumentLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createIdentityDocumentLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
