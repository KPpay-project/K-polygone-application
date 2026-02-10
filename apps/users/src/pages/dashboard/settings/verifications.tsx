import { EasyAttach } from '@/components/common/forms/easy-attach';
import { EasyDateSelector } from '@/components/common/forms/easy-date-selector';
import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import { EasySelect } from '@/components/common/forms/easy-select';
import { Typography } from '@/components/sub-modules/typography/typography';
import { addressVerificationSchema, companyVerificationSchema, identityVerificationSchema } from '@/schema/dashboard';
import { Link } from '@tanstack/react-router';
import { ArrowRight2 } from 'iconsax-reactjs';
import { Button, IconArrowRight } from 'k-polygon-assets';
import z from 'zod';

const VerificationsIdentityVerification = () => {
  const formSchema = identityVerificationSchema();
  type FormValues = z.infer<typeof formSchema>;
  function onSubmit(values: FormValues) {
    console.log(values);
  }

  const identityTypes = [
    {
      label: 'NIN',
      value: 'nin'
    },
    {
      label: 'ID Card',
      value: 'id_card'
    }
  ];

  return (
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[40px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Identity Verification</Typography>
      </div>

      <div>
        <EasyForm
          schema={formSchema}
          defaultValues={{
            identityNumber: '',
            identityType: '',
            expiringDate: ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="identityType"
              options={identityTypes}
              label="Identity Type"
              placeholder="Select Identity type"
            />
            <EasyInput<FormValues>
              name="identityNumber"
              type="text"
              label="Identity Number"
              placeholder={'122333333'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EasyDateSelector<FormValues> name="expiringDate" label="Expiring Date" placeholder="Expiring Date" />
            <EasyAttach<FormValues>
              name="attachment"
              label="Attach Identity Proof"
              renderUploaded={() => {
                return (
                  <span className="text-primary flex items-center gap-1 whitespace-nowrap">
                    View Identity Bill{' '}
                    <span className="text-primary">
                      <ArrowRight2 size={18} />
                    </span>
                  </span>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2">
            <Button
              type="submit"
              className="col-span-1 h-[42px] rounded-[10px] mt-[12px] bg-primary hover:bg-brandBlue-600"
              icon={<IconArrowRight />}
            >
              Verify Identity
            </Button>
          </div>
        </EasyForm>
      </div>
    </div>
  );
};

const VerificationsCompanyVerification = () => {
  const formSchema = companyVerificationSchema();
  type FormValues = z.infer<typeof formSchema>;
  function onSubmit(values: FormValues) {
    console.log(values);
  }

  const identityTypes = [
    {
      label: 'NIN',
      value: 'nin'
    },
    {
      label: 'ID Card',
      value: 'id_card'
    }
  ];

  return (
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[40px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Company Verification</Typography>
      </div>

      <div>
        <EasyForm
          schema={formSchema}
          defaultValues={{
            companyName: '',
            identityType: '',
            expiringDate: ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="identityType"
              options={identityTypes}
              label="Identity Type"
              placeholder="Select Identity type"
            />
            <EasyInput<FormValues> name="companyName" type="text" label="Identity Number" placeholder={'122333333'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EasyDateSelector<FormValues> name="expiringDate" label="City" placeholder="Expiring Date" />

            <EasyAttach<FormValues>
              name="attachment"
              label="Attach Identity Proof"
              renderUploaded={(file, path) => {
                return (
                  <Link to={path} target="_blank" className="text-primary flex items-center gap-1 whitespace-nowrap">
                    View Identity Bill{' '}
                    <span className="text-primary">
                      <ArrowRight2 size={18} />
                    </span>
                  </Link>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2">
            <Button
              type="submit"
              className="col-span-1 h-[42px] rounded-[10px] mt-[12px] bg-primary hover:bg-brandBlue-600"
              icon={<IconArrowRight />}
            >
              Verify Identity
            </Button>
          </div>
        </EasyForm>
      </div>
    </div>
  );
};

const VerificationsAddressVerification = () => {
  const formSchema = addressVerificationSchema();
  type FormValues = z.infer<typeof formSchema>;
  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[40px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Address Verification</Typography>
      </div>

      <div>
        <EasyForm
          schema={formSchema}
          defaultValues={{
            address: ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasyInput<FormValues> name="address" type="text" label="Identity Number" placeholder={'122333333'} />
            <EasyAttach<FormValues>
              name="attachment"
              label="Attach Identity Proof"
              renderUploaded={() => {
                return (
                  <span className="text-primary flex items-center gap-1 whitespace-nowrap">
                    View Identity Bill{' '}
                    <span className="text-primary">
                      <ArrowRight2 size={18} />
                    </span>
                  </span>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-2">
            <Button
              type="submit"
              className="col-span-1 h-[42px] rounded-[10px] mt-[12px] bg-primary hover:bg-brandBlue-600"
              icon={<IconArrowRight />}
            >
              Verify Address
            </Button>
          </div>
        </EasyForm>
      </div>
    </div>
  );
};

const SettingsVerifications = () => {
  return (
    <div className="space-y-[16px] h-full overflow-y-auto">
      <VerificationsIdentityVerification />
      <VerificationsCompanyVerification />
      <VerificationsAddressVerification />
    </div>
  );
};

export default SettingsVerifications;
