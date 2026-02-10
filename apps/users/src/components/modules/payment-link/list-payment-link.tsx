import { useQuery } from '@apollo/client';
import { cn } from '@/lib/utils';
import { formatCurrencyWithCode } from '@/utils/current';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';
import { Search, Eye, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Twitter, Facebook, Whatsapp } from 'react-social-sharing';
import { PAYMENT_LINKS_QUERY } from '@repo/api';

interface PaymentLink {
  id: string;
  name: string;
  description: string;
  amount: string;
  code: string;
  isActive: boolean;
  useCount: number;
  maxUses: number | null;
  insertedAt: string;
  expiresAt: string | null;
  completedPaymentsCount: number;
  totalCollected: string;
  checkoutUrl: string;
  redirectUrl: string | null;
  allowedChannels: string[];
  metadata: any | null;
  updatedAt: string;
}

interface PaymentLinksData {
  myPaymentLinks: {
    paymentLinks: PaymentLink[];
  };
}

const ListAllPaymentLink = () => {
  const { data, loading, error } = useQuery<PaymentLinksData>(PAYMENT_LINKS_QUERY);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingLink, setViewingLink] = useState<PaymentLink | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const paymentLinks = data?.myPaymentLinks?.paymentLinks || [];

  const filteredLinks = paymentLinks.filter(
    (link) =>
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownloadQr = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = `payment-link-${viewingLink?.name || 'qr'}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download QR code', err);
        toast.error('Failed to download QR code');
      }
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-red-100">
        <p className="text-red-600 font-medium">Failed to load payment links</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payment Links</h1>
            <p className="mt-2 text-gray-500">Create and manage payment links to collect payments easily.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[300px]">Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Code</TableHead>
                  {/* <TableHead>Usage</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                  {/* <TableHead className="text-right">Created</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      Loading payment links...
                    </TableCell>
                  </TableRow>
                ) : filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-gray-500 font-medium">No payment links found</div>
                        <div className="text-sm text-gray-400">
                          {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Create your first payment link to get started'}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((row) => (
                    <TableRow key={row.id} className="group hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium align-top py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-900 font-semibold">{row.name}</span>
                          {row.description && (
                            <span className="text-sm text-gray-500 line-clamp-1 truncate">{row.description}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <span className="font-medium text-gray-900">
                          {formatCurrencyWithCode(Number(row.amount), 'XAF')}
                        </span>
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <code className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-mono text-xs border border-gray-200">
                          {row.code}
                        </code>
                      </TableCell>
                      {/* <TableCell className="align-top py-4">
                                                <div className="flex flex-col gap-1.5 w-32">
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <span>{row.useCount} used</span>
                                                        <span>{row.maxUses ? `of ${row.maxUses}` : 'Unlimited'}</span>
                                                    </div>
                                                    {row.maxUses && (
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full transition-all duration-500",
                                                                    (row.useCount / row.maxUses) >= 1 ? "bg-amber-500" : "bg-blue-500"
                                                                )}
                                                                style={{
                                                                    width: `${Math.min((row.useCount / row.maxUses) * 100, 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell> */}
                      <TableCell className="align-top py-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            row.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-gray-50 text-gray-600 border-gray-100'
                          )}
                        >
                          {row.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setViewingLink(row)}
                          >
                            <Eye size={16} />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </div>
                      </TableCell>
                      {/* <TableCell className="text-right align-top py-4">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(row.insertedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog
        open={!!viewingLink}
        onOpenChange={(open) => {
          if (!open) {
            setViewingLink(null);
          }
        }}
      >
        <DialogContent className="p-0 overflow-hidden bg-white rounded-3xl border-0 max-w-md">
          <VisuallyHidden.Root>
            <DialogTitle>Share Payment Link</DialogTitle>
          </VisuallyHidden.Root>

          <div className="relative flex flex-col items-center">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-10 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors">
              <X size={20} className="text-red-500" />
            </DialogClose>

            <div className="pt-8 pb-8 px-6 text-center w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share QR Code Link</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Download, print, or share your payment link QR code with your customers.
              </p>

              {viewingLink && (
                <>
                  <h3 className="text-lg font-bold text-blue-900/90 uppercase tracking-wide mb-6">
                    {viewingLink.name}
                  </h3>

                  {/* Dark Card */}
                  <div
                    ref={qrRef}
                    className="bg-[#1E2548] rounded-[2rem] p-8 w-full text-white 
                                    flex flex-col items-center relative overflow-hidden"
                  >
                    <p className="text-lg font-medium mb-2">Scan here to pay</p>
                    <div className="mb-6 animate-bounce">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 4V20M12 20L6 14M12 20L18 14"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="bg-white p-4 rounded-3xl mb-6">
                      {/* Force white background for QR code to ensure contrast */}
                      <div className="bg-white">
                        <QRCode value={viewingLink.checkoutUrl || ''} size={150} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto">
                      <span>Powered by</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        KPPAY
                      </span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center gap-4 my-6">
                    <Twitter link={viewingLink.checkoutUrl || ''} />
                    <Facebook link={viewingLink.checkoutUrl || ''} />
                    <Whatsapp link={viewingLink.checkoutUrl || ''} />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full border-gray-300 h-12"
                      onClick={() => copyToClipboard(viewingLink.checkoutUrl || '')}
                    >
                      Copy link
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-red-200/50 hover:bg-red-200/80 text-red-600 font-medium h-12 gap-2"
                      onClick={handleDownloadQr}
                    >
                      Download QR <Download size={18} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListAllPaymentLink;
