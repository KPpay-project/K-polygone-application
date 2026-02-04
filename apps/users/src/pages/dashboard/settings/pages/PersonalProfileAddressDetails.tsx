import { EasyForm } from '@/components/common/forms/easy-form.tsx';
import { EasyInput } from '@/components/common/forms/easy-input.tsx';
import { EasySelect } from '@/components/common/forms/easy-select.tsx';
import { Typography } from '@/components/sub-modules/typography/typography.tsx';
import { editProfileAddressSchema } from '@/schema/dashboard.ts';
import { countries } from '@/utils/constants.ts';
import { Button } from 'k-polygon-assets';
import { useState } from 'react';
import z from 'zod';
import EditButton from './EditButton.tsx';

const PersonalProfileAddressDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const formSchema = editProfileAddressSchema();
  type FormValues = z.infer<typeof formSchema>;
  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="border  rounded-[16px] border-gray-200 px-[44px] py-[16px]">
      <div className="flex items-center justify-between">
        <Typography className="text-xl font-bold">Address</Typography>
        {!editMode && <EditButton onClick={() => setEditMode(true)} />}
      </div>

      <div>
        <EasyForm
          schema={formSchema}
          defaultValues={{
            country: '',
            street: '',
            city: '',
            timezone: ''
          }}
          onSubmit={onSubmit}
          className="mt-[32px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="country"
              options={countries.map((country) => ({ label: country.name, value: country.code }))}
              label="Country"
            />
            <EasyInput<FormValues> name="street" type="text" label="Street" placeholder={'N/A'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <EasySelect<FormValues>
              name="city"
              options={countries.map((country) => ({ label: country.name, value: country.code }))}
              label="City"
            />
            <EasyInput<FormValues> name="timezone" type="text" placeholder={'N/A'} label="Timezone" />
          </div>

          {editMode && (
            <div className="flex justify-start gap-[16px]">
              <Button
                onClick={() => {
                  setEditMode(false);
                }}
                className="w-[177px] h-[42px] rounded-[10px] mt-[32px] bg-gray-100 hover:bg-gray-100/10 text-black"
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                className="w-[177px] h-[42px] rounded-[10px] mt-[32px] bg-primary hover:bg-brandBlue-600"
              >
                Save Changes
              </Button>
            </div>
          )}
        </EasyForm>
      </div>
    </div>
  );
};

export default PersonalProfileAddressDetails;
