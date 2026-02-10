import React from 'react';
import RateItem from './rate-item';
import { ModularCard } from '@/components/sub-modules/card/card';
import { ArrowDown2 } from 'iconsax-reactjs';

const pseudoRates = [
  {
    currencyPairs: ['USD', 'EUR'],
    fromRate: 0.7897789990076549,
    toRate: 1.1323
  },
  {
    currencyPairs: ['GBP', 'EUR'],
    fromRate: 0.4897789990076549,
    toRate: 1.1323
  },
  {
    currencyPairs: ['NGN', 'EUR'],
    fromRate: 0.9897789990076549,
    toRate: 1.1323
  },
  {
    currencyPairs: ['USD', 'NGN'],
    fromRate: 0.7857789990076549,
    toRate: 1.1323
  },
  {
    currencyPairs: ['GHC', 'EUR'],
    fromRate: 0.6897789990076549,
    toRate: 1.1323
  }
];

const TodaysRates = () => (
  <ModularCard title="Today's Rate">
    <div>
      <div className="flex justify-between mb-8 items-center gap-[8px] bg-gray-100 p-[12px] px-[22px] rounded-[12px] mt-[16px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-gray-500 text-[12px]">Change</span>
          <div className="size-[20px] bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">$</span>
          </div>
          <span className="text-[14px] font-light text-gray-900 py-2 ml-0.5">United State Dollars</span>
        </div>
        <ArrowDown2 size={20} className="text-gray-500" />
      </div>

      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="flex flex-col mt-[32px]">
          {pseudoRates.map((item, index) => {
            return <RateItem key={index} {...item} />;
          })}
        </div>
      </div>
    </div>
  </ModularCard>
);

export default TodaysRates;
