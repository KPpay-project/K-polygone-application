import { Typography } from '../typography';
import { ReactNode } from 'react';
import { EmptyTicketData } from './icons/empty-ticket-data';
import { AlertTriangle, FileX, Search, Wallet } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  height?: string;
  className?: string;
  hasTitle?: boolean;
  hasDescription?: boolean;
}

export const EmptyState = ({
  icon = <Wallet className="w-16 h-16 text-gray-400" />,
  title = 'No Data Found',
  description = 'There is no data to display at the moment.',
  height = 'h-[30vh]',
  className = '',
  hasTitle = true,
  hasDescription = true,
}: EmptyStateProps) => {
  return (
    <>
      <div className={`w-full  flex items-center justify-center ${height} ${className}`}>
        <div className="flex flex-col items-center gap-4 py-5">
          {icon}

          <div className="text-center mt-2 w-[90%] lg:w-[400px]">
            {hasTitle && (
              <Typography variant="h6" className="  font-normal my-3">
                {title}
              </Typography>
            )}

            {hasDescription && (
              <Typography className="text-gray-500 font-thin mt-2" variant={'small'}>
                {description}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const DataIsEmpty = () => {
  return <EmptyState />;
};

export const EmptyTicketState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return <EmptyState icon={<EmptyTicketData />} {...props} />;
};

export const EmptyTransactionsState = (
  props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>,
) => {
  return (
    <EmptyState
      icon={<FileX size={64} className="text-gray-400" />}
      title="No Transactions Found"
      description="Looks like you haven't made any transactions yet."
      {...props}
    />
  );
};

export const EmptySearchState = (
  props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>,
) => {
  return (
    <EmptyState
      icon={<Search size={64} className="text-gray-400" />}
      title="No Results Found"
      description="Try adjusting your search or filters to find what you're looking for."
      {...props}
    />
  );
};

export const EmptyWalletState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<Wallet size={64} className="text-gray-400" />}
      title="No Wallet Found"
      description="You don't have any wallets yet."
      {...props}
    />
  );
};

export const ErrorState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<AlertTriangle size={64} className="text-amber-500" />}
      title="Something went wrong"
      description="We encountered an error. Please try again later."
      {...props}
    />
  );
};

export const EmptyDocumentsState = (props: Omit<EmptyStateProps, 'icon'>) => {
  return (
    <EmptyState
      icon={<FileX size={64} className="text-gray-400" />}
      title="No Documents Found"
      description="There are no documents to display."
      {...props}
    />
  );
};
