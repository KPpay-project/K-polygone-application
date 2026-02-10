import { CustomFormMessage } from '@/components/common/forms/form-message';
import { Button } from 'k-polygon-assets';
import { useNavigate } from '@tanstack/react-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { identityDocumentSchema } from '@/schema/verifications';
import { useCreateIdentityDocument } from '@/hooks/api/kyc/use-create-identity-document';
import { useState } from 'react';
import { Loading } from '@/components/common';
import { useFileUploadEnhanced } from '@/hooks/use-file-upload-enhanced';
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { z } from 'zod';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useForm } from 'react-hook-form';

const IDVerificationScreen = () => {
  const navigate = useNavigate();
  const { createIdentityDocument } = useCreateIdentityDocument();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileUpload = useFileUploadEnhanced({
    folder: 'kyc/identity-documents',
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    onProgress: (progress) => {
      console.log('Upload progress:', progress.percentage + '%');
    },
    onSuccess: (result) => {
      console.log('Upload successful:', result);
      // Update form with the uploaded file URL
      form.setValue('identityDocument', result.url);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      setValidationErrors([error]);
    }
  });

  type FormValues = z.infer<typeof identityDocumentSchema>;

  const documentTypes = [
    { label: 'NIN', value: 'nin' },
    { label: 'Passport', value: 'passport' },
    { label: "Driver's License", value: 'drivers_license' },
    { label: 'National ID', value: 'national_id' }
  ];

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

  const form = useForm<FormValues>({
    resolver: zodResolver(identityDocumentSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    defaultValues: {
      documentType: '',
      documentNumber: '',
      dateOfIssue: undefined,
      expiryDate: undefined,
      issuingAuthority: '',
      identityDocument: null
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setValidationErrors([]);

      // Create identity document with the file directly (GraphQL expects Upload! type)
      const { data } = await createIdentityDocument({
        variables: {
          input: {
            documentType: values.documentType,
            documentNumber: values.documentNumber.trim(),
            dateOfIssue: values.dateOfIssue.toISOString().split('T')[0],
            expiryDate: values.expiryDate.toISOString().split('T')[0],
            issuingAuthority: values.issuingAuthority.trim(),
            documentUrl: values.identityDocument instanceof File ? values.identityDocument : undefined
          }
        }
      });

      if (data?.createIdentityDocument.success) {
        navigate({ to: '/settings/verifications/financial-information' });
      } else if (data?.createIdentityDocument.errors) {
        setValidationErrors(data.createIdentityDocument.errors.map((error) => error.message));
      } else {
        setValidationErrors(['Failed to submit identity document']);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the form';
      setValidationErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <Loading />
            <p className="mt-2 text-gray-600">Processing your request...</p>
          </div>
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
          {validationErrors.map((error, index) => (
            <p key={index} className="text-red-600 flex items-center gap-2">
              <span className="text-red-500">•</span>
              {error}
            </p>
          ))}
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step 5 of 7</span>
          <span className="text-sm text-gray-500">Identity Document Verification</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(5 / 7) * 100}%` }}></div>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-4">Identity Document</h2>
      <p className="text-gray-600 mb-6">Upload your identity</p>

      <Form {...(form as any)}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">Type of Document</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear document number when type changes
                        form.setValue('documentNumber', '');
                        form.trigger('documentNumber');
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select document type</option>
                      {documentTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.documentType} scope="error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">Document Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={getDocumentNumberPlaceholder(form.watch('documentType'))}
                      {...field}
                      onChange={(e) => {
                        // Auto-format based on document type
                        let value = e.target.value;
                        const documentType = form.watch('documentType');

                        if (documentType === 'nin' || documentType === 'national_id') {
                          // Only allow digits
                          value = value.replace(/[^\d]/g, '');
                        } else if (documentType === 'passport' || documentType === 'drivers_license') {
                          // Allow alphanumeric, convert to uppercase
                          value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                        }

                        field.onChange(value);
                        form.trigger('documentNumber');
                      }}
                    />
                  </FormControl>
                  {!form.formState.errors.documentNumber && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getDocumentNumberHelperText(form.watch('documentType'))}
                    </p>
                  )}
                  <CustomFormMessage message={form.formState.errors.documentNumber} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="dateOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">Date of Issue</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      placeholder="Select Date of Issue"
                    />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.dateOfIssue} scope="error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">Expiry Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? field.value.toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      placeholder="Select Expiring date"
                    />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.expiryDate} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control as any}
            name="issuingAuthority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Issuing Authority</FormLabel>
                <FormControl>
                  <Input placeholder="Lagos" {...field} />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.issuingAuthority} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="identityDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">Upload Identity Document</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file first
                          const validation = fileUpload.validateFile(file);
                          if (!validation.isValid) {
                            setValidationErrors([validation.error || 'Invalid file']);
                            return;
                          }

                          field.onChange(file);
                          form.trigger('identityDocument');
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md p-2"
                      disabled={isSubmitting || fileUpload.isUploading}
                    />

                    {/* Upload Progress */}
                    {fileUpload.isUploading && fileUpload.progress && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileUpload.progress.percentage}%` }}
                        ></div>
                        <p className="text-sm text-blue-600 mt-1">Uploading... {fileUpload.progress.percentage}%</p>
                      </div>
                    )}

                    {/* File Info */}
                    {field.value && (
                      <div className="mt-2 text-sm">
                        {field.value instanceof File ? (
                          <div className="text-green-600">
                            {fileUpload.getFileTypeIcon(field.value.name)} Selected: {field.value.name} (
                            {fileUpload.formatFileSize(field.value.size)})
                          </div>
                        ) : (
                          <div className="text-green-600">✅ Document uploaded successfully</div>
                        )}
                      </div>
                    )}

                    {/* Upload Error */}
                    {fileUpload.error && <div className="text-red-600 text-sm">❌ {fileUpload.error}</div>}
                  </div>
                </FormControl>
                <p className="text-sm text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF. Maximum size: 10MB</p>
                <CustomFormMessage message={form.formState.errors.identityDocument as any} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
            icon={<IconArrowRight />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save and continue'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default IDVerificationScreen;
