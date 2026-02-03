import BasicProfileDetails from './BasicProfileDetails.tsx';
import PersonalProfileDetails from './PersonalProfileDetails.tsx';
// import PersonalProfileAddressDetails from './PersonalProfileAddressDetails';

const SettingsMyProfile = () => {
  return (
    <div className="space-y-[16px] overflow-y-auto">
      <BasicProfileDetails />
      <PersonalProfileDetails />
      {/* <PersonalProfileAddressDetails /> */}
    </div>
  );
};

export default SettingsMyProfile;
