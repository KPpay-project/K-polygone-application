import { Typography } from '@/components/sub-modules/typography/typography';
import { Edit } from 'iconsax-reactjs';

export const EditButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="px-[15px] py-[3.5px] flex border items-center gap-[5px] border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <Typography>Edit</Typography>
      <Edit size={16} />
    </div>
  );
};

export default EditButton;
