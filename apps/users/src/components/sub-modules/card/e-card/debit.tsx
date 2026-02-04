'';

import React from 'react';
import clsx from 'clsx';

interface PaymentCardProps {
  holderName?: string;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  width?: string;
  height?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  className?: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  holderName = 'MICK GARDY',
  width = 'w-96',
  height = 'h-60',
  gradientFrom = 'from-slate-500',
  gradientVia = 'via-slate-600',
  gradientTo = 'to-slate-700',
  className = ''
}) => {
  return (
    <div className={'bg-gray-400/30  p-[6px] rounded-xl'}>
      <div
        className={clsx(
          'relative rounded-xl shadow-2xl overflow-hidden',
          width,
          height,
          `bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`,
          className
        )}
      >
        <div className="absolute -top-20 -left-20 w-80 h-80 border-2 border-white/15 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 border-2 border-white/10 rounded-full" />

        <div className="absolute top-6 right-6"></div>

        <div className="absolute top-20 left-8 w-14 h-11 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg border border-gray-500 shadow-sm">
          <div className="absolute inset-1 grid grid-cols-3 gap-px">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gray-500/60 rounded-sm" />
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full border border-gray-700" />
        </div>

        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
          <p className="text-white text-sm font-medium tracking-[0.15em] font-sans uppercase">{holderName}</p>
          <img src="/master_card.svg" alt="MasterCard" className="w-10 h-auto object-contain" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/20 pointer-events-none" />
      </div>
    </div>
  );
};

export default PaymentCard;
