import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateTicketMessage } from '@/hooks/api/use-ticket';
import { Link } from 'iconsax-reactjs';

interface TicketCommentFormProps {
  ticketId: string;
  onCommentSent?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const TicketCommentForm = ({
  ticketId,
  onCommentSent,
  disabled = false,
  placeholder = 'Write a comment...',
  className = ''
}: TicketCommentFormProps) => {
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, loading } = useCreateTicketMessage();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim() || disabled) return;

    if (!ticketId) {
      console.error('No ticket ID provided');
      return;
    }

    try {
      await sendMessage({
        message: comment,
        messageAttachment: selectedFile ? selectedFile : null,
        ticketId: ticketId
      });
      setComment('');
      setSelectedFile(null);
      onCommentSent?.();
    } catch (error) {
      console.error('Failed to send comment:', error);
    }
  };

  const isDisabled = loading || !comment.trim() || disabled;

  return (
    <div className={`rounded-xl border border-blue-600 bg-white p-4 space-y-3 ${className}`}>
      <div className="text-sm font-medium">Add Comment</div>
      <textarea
        placeholder={placeholder}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={disabled}
        className="h-[40px] w-full  rounded-md p-3
        disabled:bg-gray-50 disabled:cursor-not-allowed border-0 outline-none"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-500">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="focus:outline-none"
            tabIndex={0}
          >
            <Link className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect} tabIndex={-1} />
          {selectedFile && <span className="ml-2 text-xs text-blue-700">{selectedFile.name}</span>}
        </div>
        <Button className="bg-blue-700" onClick={handleSendComment} disabled={isDisabled}>
          {loading ? 'Sending...' : 'Comment'}
        </Button>
      </div>
    </div>
  );
};

export default TicketCommentForm;
