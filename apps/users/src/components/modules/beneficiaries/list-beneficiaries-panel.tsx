import { FETCH_BENEFICIARIES_QUERY } from '@repo/api';
import { useQuery } from '@apollo/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { BENEFICIARY_TYPE_ENUM } from '@/enums';

export type BeneficiaryType = BENEFICIARY_TYPE_ENUM;

export interface Beneficiary {
  id: string;
  name: string;
  number: string;
  type: string;
  providerName?: string;
  insertedAt?: string;
  updatedAt?: string;
}

interface BeneficiariesQueryData {
  myBeneficiaries: {
    entries: Beneficiary[];
    totalEntries: number;
  };
}

interface ListBeneficiariesPanelProps {
  onSelectBeneficiary?: (beneficiary: Beneficiary) => void;
  selectedBeneficiary?: Beneficiary | null;
  beneficiaryType?: BeneficiaryType;
  providerName?: string;
}

const ListBeneficiariesPanel = ({
  onSelectBeneficiary,
  selectedBeneficiary,
  beneficiaryType,
  providerName
}: ListBeneficiariesPanelProps) => {
  const { data, loading } = useQuery<BeneficiariesQueryData>(FETCH_BENEFICIARIES_QUERY);

  const beneficiaries = useMemo(() => {
    const entries = data?.myBeneficiaries?.entries || [];
    const validEntries = entries.filter((b) => b !== null && b !== undefined);
    let filtered = validEntries;
    if (beneficiaryType) {
      filtered = filtered.filter((b) => b.type === beneficiaryType);
    }
    if (providerName) {
      filtered = filtered.filter((b) => b.providerName === providerName);
    }
    return filtered;
  }, [data, beneficiaryType, providerName]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-gray-900">Beneficiaries</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (beneficiaries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-900">Beneficiaries</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 pt-2">
        {beneficiaries.map((beneficiary) => {
          const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(beneficiary.name)}`;
          const isSelected = selectedBeneficiary?.id === beneficiary.id;

          return (
            <div
              key={beneficiary.id}
              className={cn(
                'flex flex-col items-center   gap-2 min-w-[70px] cursor-pointer transition-all',
                isSelected && 'scale-105'
              )}
              onClick={() => onSelectBeneficiary?.(beneficiary)}
            >
              <Avatar
                className={cn(
                  'w-12 h-12 ring-2 ring-transparent transition-all',
                  isSelected && 'ring-primary ring-offset-2'
                )}
              >
                <AvatarImage src={avatarUrl} alt={beneficiary.name} />
                <AvatarFallback>{beneficiary.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <span
                className={cn(
                  'text-sm font-medium truncate max-w-[70px] text-center',
                  isSelected ? 'text-primary' : 'text-gray-700'
                )}
              >
                {beneficiary.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListBeneficiariesPanel;
