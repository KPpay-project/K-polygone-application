import moment from 'moment';
import TicketCommentForm from '@/components/ticket-comment-form';
import UserInfoCard from '@/components/ui/user-info-card';
import StatusBadge from '../ui/status-badge';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'sonner';

enum TicketResolutionEnum {
  RESOLVED = 'RESOLVED',
  UNRESOLVED = 'UNRESOLVED'
}

const RESOLVE_TICKET_MUTATION = gql`
  mutation ResolveTicket($resolution: TicketResolutionEnum!, $ticketId: ID!) {
    resolveTicket(resolution: $resolution, ticketId: $ticketId) {
      errors
      message
      success
    }
  }
`;
interface PreviewAndUpdateDisputeActionProps {
  dispute?: any | null;
}

const LabelRow = ({ label, value }: { label: string; value?: any }) => (
  <div className="grid grid-cols-3 gap-4 py-3">
    <div className="text-sm text-gray-500 col-span-1">{label}</div>
    <div className="text-sm text-gray-900 col-span-2 break-all">{value ?? '—'}</div>
  </div>
);

const PreviewAndUpdateDisputeAction = ({ dispute }: PreviewAndUpdateDisputeActionProps) => {
  const user = dispute?.customerName
    ? { name: dispute.customerName, email: dispute.email, phone: dispute.phone }
    : null;

  const [resolution, setResolution] = useState<TicketResolutionEnum | null>(null);
  const [resolveTicket, { loading: resolving, data: resolveData, error: resolveError }] =
    useMutation(RESOLVE_TICKET_MUTATION);

  const handleResolve = async (res: TicketResolutionEnum) => {
    if (!dispute?.ticketNumber) return;
    setResolution(res);
    const toastId = toast.loading('Resolving ticket...');
    try {
      await resolveTicket({
        variables: {
          resolution: res,
          ticketId: dispute.ticketNumber
        }
      });
      toast.success('Ticket resolution updated.', { id: toastId });
    } catch {
      toast.error('Failed to resolve ticket.', { id: toastId });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <UserInfoCard
        name={user?.name ?? 'Unknown user'}
        email={user?.email ?? '—'}
        avatar=""
        status={dispute?.customerStatus}
        className="w-full"
      />

      <div>
        <div className="text-base font-semibold mb-4">Transaction detail</div>
        <div className="rounded-xl bg-white p-4">
          <LabelRow label="Ticket #" value={dispute?.ticketNumber} />
          <LabelRow label="Subject" value={dispute?.ticketSubject} />
          <LabelRow label="Priority" value={dispute?.priority} />
          <LabelRow label="Status" value={<StatusBadge status={dispute?.status} />} />
          <LabelRow
            label="Date"
            value={dispute?.insertedAt ? moment(dispute.insertedAt).format('DD MMM YYYY, hh:mm A') : '—'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-base font-semibold">
          {dispute?.ticketSubject || 'No subject provided for this dispute.'}
        </div>
        <div className="text-sm leading-6 text-gray-700">
          {dispute?.message || 'No message provided for this dispute.'}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold border ${resolution === TicketResolutionEnum.RESOLVED ? 'bg-green-600 text-white' : 'bg-white text-green-700 border-green-600'}`}
          disabled={resolving}
          onClick={() => handleResolve(TicketResolutionEnum.RESOLVED)}
        >
          Mark as Resolved
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold border ${resolution === TicketResolutionEnum.UNRESOLVED ? 'bg-red-600 text-white' : 'bg-white text-red-700 border-red-600'}`}
          disabled={resolving}
          onClick={() => handleResolve(TicketResolutionEnum.UNRESOLVED)}
        >
          Mark as Unresolved
        </button>
      </div>
      {resolveData && (
        <div className={`mt-2 text-sm ${resolveData.resolveTicket.success ? 'text-green-600' : 'text-red-600'}`}>
          {resolveData.resolveTicket.message}
        </div>
      )}
      {resolveError && <div className="mt-2 text-sm text-red-600">{resolveError.message}</div>}

      <TicketCommentForm ticketId={dispute?.ticketNumber} disabled={!dispute?.ticketNumber} />
    </div>
  );
};

export default PreviewAndUpdateDisputeAction;
