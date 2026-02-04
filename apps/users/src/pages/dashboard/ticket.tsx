//@ts-nocheck
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket } from '@repo/types';
import { PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '@/components/layouts/dashboard-layout.tsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CreateTicketAction from '@/components/actions/create-ticket-action';
import TicketCard from '@/components/modules/ticket/ticket-card';
import { ModularCard } from '@/components/sub-modules/card/card';
import SuccessAlertFallback from '@/components/common/fallbacks/success-alert';
import { EmptyTicketState } from '@/components/common/fallbacks';
import { useGetCustomersTickets } from '@/hooks/api/ticket';
import { ServerErrorFallbackScreen } from '@/components/common/fallbacks/server-error-fallback.tsx';

const CreateTicketButton = ({
  onTicketCreated,
  open,
  setOpen,
  showSuccess,
  setShowSuccess
}: {
  onTicketCreated: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="mt-4 sm:mt-0 bg-primary hover:bg-brandBlue-600 text-white flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Create Ticket
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Ticket</SheetTitle>
          <SheetDescription>
            {showSuccess ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <SuccessAlertFallback
                  title="Ticket Created!"
                  body="Your ticket has been submitted successfully."
                  buttonText="Close"
                  onAction={() => setShowSuccess(false)}
                />
              </div>
            ) : (
              <CreateTicketAction
                onTicketCreated={() => {
                  onTicketCreated();
                  setShowSuccess(true);
                }}
                onClose={() => setOpen(false)}
              />
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const TicketPage = () => {
  const { t } = useTranslation();
  const [setSelectedTicket] = useState<Ticket | null>(null);

  const { data, loading, error, refetch } = useGetCustomersTickets();
  const tickets = useMemo(() => data?.getUsersTickets || [], [data]);

  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTicketCreated = () => {
    refetch();
  };

  if (error) {
    setTimeout(() => {
      window.location.href = '/onboarding/login?user=user';
    }, 2000);
  }

  return (
    <DashboardLayout>
      {error && <ServerErrorFallbackScreen />}
      <div className="w-[95%] mx-auto">
        <ModularCard
          title={t('ticket.manageDescription', 'Tickets')}
          headerAction={
            <CreateTicketButton
              onTicketCreated={handleTicketCreated}
              open={open}
              setOpen={setOpen}
              showSuccess={showSuccess}
              setShowSuccess={setShowSuccess}
            />
          }
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"></div>

            <div className="overflow-hidden p-4">
              {tickets.length === 0 && !loading ? (
                <EmptyTicketState title="No Tickets Found" description="You have not created any tickets yet." />
              ) : (
                <div className="grid grid-cols-1  gap-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                      <TicketCard ticket={ticket} />
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <div className="text-center w-full py-10">
                  <p>Loading tickets...</p>
                </div>
              )}
              {error && (
                <div className="text-center w-full py-10 text-red-500">
                  <p>Error loading tickets: {error.message}</p>
                </div>
              )}
            </div>

            {/* <div className="flex items-center justify-between mt-6 px-4">
              <button
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={true}
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">Page 1 of 10</div>
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div> */}
          </div>
        </ModularCard>
      </div>
    </DashboardLayout>
  );
};

export default TicketPage;
