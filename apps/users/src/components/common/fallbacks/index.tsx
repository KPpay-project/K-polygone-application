import { Typography } from '@/components/sub-modules/typography/typography';
import { WalletIllustrationIcon } from 'k-polygon-assets/icons';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { EmptyTicketData } from '@/assets/svgs/empty-ticket-data';
import { AlertTriangle, FileX, Search, Wallet } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  height?: string;
  className?: string;
  useTranslation?: boolean;
  ns?: string;
}

export const EmptyState = ({
  icon = <WalletIllustrationIcon />,
  title = 'dashboard.card.noCardsFound',
  description = 'dashboard.card.noCardsDescription',
  height = 'h-[30vh]',
  className = '',
  useTranslation: shouldTranslate = true,
  ns
}: EmptyStateProps) => {
  const { t } = useTranslation(ns);

  const displayTitle = shouldTranslate ? t(title) : title;
  const displayDescription = shouldTranslate ? t(description) : description;

  return (
    <div className={`w-full flex items-center justify-center ${height} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {icon}

        <div className="text-center mt-2 w-[90%] lg:w-[400px]">
          <Typography variant="h3" className=" text-black  text-[18px] my-3">
            {displayTitle}
          </Typography>
          <Typography className="text-gray-500  mt-2">{displayDescription}</Typography>
        </div>
      </div>
    </div>
  );
};

export const DataIsEmpty = () => {
  return <EmptyState />;
};

export const EmptyTicketState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return <EmptyState icon={<EmptyTicketData />} {...props} />;
};

export const EmptyTransactionsState = (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => {
  return (
    <EmptyState
      icon={<FileX size={64} className="text-gray-400" />}
      title="dashboard.transactions.noTransactionsFound"
      description="dashboard.transactions.noTransactionsDescription"
      {...props}
    />
  );
};

export const EmptySearchState = (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => {
  return (
    <EmptyState
      icon={<Search size={64} className="text-gray-400" />}
      title="common.search.noResultsFound"
      description="common.search.tryDifferentSearch"
      {...props}
    />
  );
};

export const EmptyWalletState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<Wallet size={64} className="text-gray-400" />}
      title="dashboard.wallet.noWalletFound"
      description="dashboard.wallet.noWalletDescription"
      {...props}
    />
  );
};

export const ErrorState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<AlertTriangle size={64} className="text-amber-500" />}
      title="common.error.somethingWentWrong"
      description="common.error.tryAgainLater"
      {...props}
    />
  );
};

export const EmptyDocumentsState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<FileX size={64} className="text-gray-400" />}
      title="common.documents.noDocumentsFound"
      description="common.documents.noDocumentsDescription"
      {...props}
    />
  );
};
