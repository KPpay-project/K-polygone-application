import { Typography } from '@/components/sub-modules/typography/typography';
import { ArrowRight } from 'iconsax-reactjs';

interface RateItemProps {
  currencyPairs: string[];
  fromRate: number;
  toRate: number;
}

const RateItem = ({ currencyPairs, fromRate, toRate }: RateItemProps) => {
  return (
    <div className="w-full justify-between px-[18px] py-[16px] flex items-center border-b border-[#E7EAEF]">
      <div>
        <div className="flex items-center gap-[10px]">
          <Typography className="font-bold">{currencyPairs[0]}</Typography>
          <ArrowRight size={18} />
          <Typography className="font-bold">{currencyPairs[1]}</Typography>
        </div>
        <Typography className="text-[10px]">{toRate}</Typography>
      </div>
      <div>
        <div className="flex items-center gap-[10px]">
          <Typography className="font-bold">{currencyPairs[1]}</Typography>
          <ArrowRight size={18} />
          <Typography className="font-bold">{currencyPairs[0]}</Typography>
        </div>
        <Typography className="text-[10px]">{fromRate}</Typography>
      </div>
    </div>
  );
};

export default RateItem;
