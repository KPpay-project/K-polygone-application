import React, { useRef, useState } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Button, Input } from 'k-polygon-assets';
import { ArrowRight, InfoCircle, Document } from 'iconsax-reactjs';
import { CurrencyDropdown } from './currency-dropdown';
import { useTranslation } from 'react-i18next';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { TransferMethod } from './transfer-money';
import { Upload } from 'lucide-react';
import DefaultModal from '@/components/sub-modules/popups/modal';

interface BulkTransferFormProps {
  onProceed: (payload: { reason: string; file: File | null; currency: string }) => void;
  selectedMethod: TransferMethod;
}

export const BulkTransferForm: React.FC<BulkTransferFormProps> = ({ onProceed, selectedMethod }) => {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState<string>('USD');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, any>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  const handleChooseFile = () => fileInputRef.current?.click();

  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '_');
  const hasAny = (headers: string[], variants: string[]) => {
    const set = new Set(headers.map(normalize));
    return variants.some((v) => set.has(normalize(v)));
  };

  const getRequirements = (method: TransferMethod) => {
    if (method === 'kpay') {
      return {
        required: [['email', 'recipient_email', 'recipientEmail']],
        amount: [['amount', 'amt', 'value']],
        optional: [['reason', 'description', 'note']]
      };
    }
    if (method === 'bank') {
      return {
        required: [['account_number', 'accountNumber', 'iban']],
        amount: [['amount', 'amt', 'value']],
        optional: [['reason', 'description', 'note']]
      };
    }
    // card or others
    return {
      required: [['destination', 'recipient', 'email', 'phone']],
      amount: [['amount', 'amt', 'value']],
      optional: [['reason', 'description', 'note']]
    };
  };

  const validateHeaders = (headers: string[]) => {
    const req = getRequirements(selectedMethod);
    const missing: string[] = [];
    if (!hasAny(headers, req.required.flat())) {
      missing.push(selectedMethod === 'kpay' ? 'email' : selectedMethod === 'bank' ? 'account number' : 'destination');
    }
    if (!hasAny(headers, req.amount.flat())) {
      missing.push('amount');
    }
    setCsvHeaders(headers);
    if (missing.length) {
      setFileError(`Missing required column(s): ${missing.join(', ')}`);
      return false;
    }
    setFileError('');
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setFileError('');
      setCsvHeaders([]);
      setPreviewRows([]);
      return;
    }
    const ext = f.name.split('.').pop()?.toLowerCase();
    const allowedExt = ['csv', 'xls', 'xlsx'];
    if (!ext || !allowedExt.includes(ext)) {
      setFile(null);
      setFileError('Unsupported file type. Please upload a CSV or Excel (.xls, .xlsx) file.');
      e.currentTarget.value = '';
      setCsvHeaders([]);
      setPreviewRows([]);
      return;
    }

    if (ext === 'csv') {
      let text = '';
      try {
        text = await f.text();
      } catch (err) {
        console.error('Failed to read CSV file', err);
        setFile(null);
        setFileError('Could not read the file. Please ensure it is a valid CSV or Excel file.');
        e.currentTarget.value = '';
        setCsvHeaders([]);
        setPreviewRows([]);
        return;
      }
      // Parse with header and robust empty line handling; let Papa auto-detect delimiter
      const parsed = Papa.parse<string[]>(text, {
        header: true,
        skipEmptyLines: 'greedy',
        delimitersToGuess: [',', ';', '\t', '|']
      });
      let headers: string[] = parsed.meta.fields || [];
      let rows: Record<string, any>[] = [];
      // Fallback: if headers are missing/blank, try deriving from the first line and reparse without header
      if (!headers.length || headers.every((h) => !h || String(h).trim() === '')) {
        const firstLine = text.split(/\r?\n/)[0] || '';
        const guessDelimiter = firstLine.includes(';') ? ';' : firstLine.includes('\t') ? '\t' : ',';
        headers = firstLine.split(guessDelimiter).map((h) => String(h).trim());
        const parsedNoHeader = Papa.parse<string[]>(text, {
          header: false,
          skipEmptyLines: 'greedy',
          delimitersToGuess: [',', ';', '\t', '|']
        });
        const rawRows = (parsedNoHeader.data || []) as string[][];
        rows = rawRows.slice(1).map((r) => {
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => {
            obj[h] = r[i];
          });
          return obj;
        });
      } else {
        rows = (parsed.data as any[]).filter(Boolean) as Record<string, any>[];
      }
      const ok = validateHeaders(headers);
      if (!ok) {
        setFile(null);
        e.currentTarget.value = '';
        setPreviewRows([]);
        return;
      }
      setFileError('');
      setCsvHeaders(headers);
      setPreviewRows(rows.slice(0, 100));
      setFile(f);
      return;
    }

    // Excel branch
    let ab: ArrayBuffer;
    try {
      ab = await f.arrayBuffer();
    } catch (err) {
      console.error('Failed to read Excel file', err);
      setFile(null);
      setFileError('Could not read the file. Please ensure it is a valid CSV or Excel file.');
      e.currentTarget.value = '';
      setCsvHeaders([]);
      setPreviewRows([]);
      return;
    }
    const workbook = XLSX.read(ab, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
    const headers = (json[0] || []).map((h: any) => String(h));
    const rows: Record<string, any>[] = (json.slice(1) || []).map((row: any[]) => {
      const obj: Record<string, any> = {};
      headers.forEach((h: string, i: number) => {
        obj[h] = row[i];
      });
      return obj;
    });
    const ok = validateHeaders(headers);
    if (!ok) {
      setFile(null);
      e.currentTarget.value = '';
      setPreviewRows([]);
      return;
    }
    setFileError('');
    setCsvHeaders(headers);
    setPreviewRows(rows.slice(0, 100));
    setFile(f);
  };

  const handleClearFile = () => {
    setFile(null);
    setCsvHeaders([]);
    setPreviewRows([]);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProceed = () => {
    onProceed({ reason, file, currency });
  };

  const handleDownloadTemplate = () => {
    // Dynamic headers & sample row based on selected method
    const firstColHeader =
      selectedMethod === 'bank'
        ? t('transfer.bankAccount') || 'Bank Account'
        : selectedMethod === 'card'
          ? t('transfer.destination') || 'Destination'
          : t('transfer.receiver') || 'Receiver';

    const paymentMethodValue =
      selectedMethod === 'kpay' ? 'K-Pay' : selectedMethod === 'bank' ? 'Bank Transfer' : 'Card';

    const headers = [
      firstColHeader,
      t('transfer.amount') || 'Amount',
      t('transfer.currency') || 'Currency',
      t('transfer.note') || 'Note',
      t('transfer.paymentMethod') || 'Payment Method'
    ];
    const sampleFirstCol = selectedMethod === 'bank' ? 'DE89370400440532013000' : 'example@example.com';
    const sample = [sampleFirstCol, 100.0, 'USD', 'Sample Note', paymentMethodValue];
    const wsData = [headers, sample];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'bulk-transfer-template.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header bar with currency and balance placeholder */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <CurrencyDropdown selectedCurrency={currency} onCurrencyChange={setCurrency} />
        </div>
        <Typography className="text-base font-semibold text-gray-800">$1000</Typography>
      </div>
      {/* Upload helper header */}
      <div className="flex flex-col items-center text-center gap-2">
        <Typography className="text-lg font-semibold text-gray-800">
          {t('transfer.uploadRecipientsTitle') || 'Upload a CSV or Excel file containing the list of recipients'}
        </Typography>
        <Typography className="text-sm text-gray-600">
          {t('transfer.uploadRecipientsSubtitle') ||
            'Please ensure you follow the format specified in the file template'}{' '}
          <button
            type="button"
            onClick={() => setIsTemplateOpen(true)}
            className="text-red-600 underline hover:text-red-700"
          >
            {t('transfer.fileTemplate') || 'file template'}
          </button>
        </Typography>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Typography className="text-sm font-medium text-gray-700">
          {t('transfer.reason') || 'Reason for transfer'}
        </Typography>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('transfer.reasonPlaceholder') || 'Salary'}
          className="w-full"
          name="bulkReason"
        />
      </div>

      <div className="space-y-3">
        <Typography className="text-sm font-medium text-gray-700">
          {t('transfer.uploadCsv') || 'Upload CSV/Excel File'}
        </Typography>
        <div
          className={`relative border-2 border-dashed ${file && !fileError ? 'border-green-500' : !file && fileError ? 'border-red-500' : 'border-gray-300'} bg-white rounded-xl px-3 py-3 text-left h-64`}
        >
          {file && previewRows.length ? (
            <>
              <button
                type="button"
                aria-label={t('common.remove') || 'Remove'}
                onClick={handleClearFile}
                className="absolute top-2 right-2 z-50 inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-400 shadow"
              >
                ×
              </button>
              <div className="h-full w-full overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {csvHeaders.map((h) => (
                        <th key={h} className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="odd:bg-white even:bg-gray-50">
                        {csvHeaders.map((h) => (
                          <td key={h} className="px-3 py-2 text-xs text-gray-700 border-b align-top">
                            {row[h] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Upload size={32} />
              <Typography className="text-xs text-gray-600">
                {/* Dynamic helper based on selected method */}
                {selectedMethod === 'kpay'
                  ? 'Upload a CSV file containing mobile money numbers'
                  : selectedMethod === 'bank'
                    ? 'Upload a CSV/Excel file containing recipient account number and amount. Reason/description is optional.'
                    : 'Upload a CSV/Excel file containing destination and amount. Reason/description is optional.'}
              </Typography>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChooseFile}
                  className="px-8 rounded-xl bg-gray-100"
                >
                  <Document size={28} className="text-gray-700" />
                  {t('common.chooseFile') || 'Choose File'}
                </Button>
                {!file && fileError && <Typography className="mt-2 text-xs text-red-600">{fileError}</Typography>}
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Tip box */}
        <div className="flex items-start gap-3 bg-gray-100 rounded-xl px-4 py-3">
          <InfoCircle size={18} />
          <Typography className="text-sm text-gray-700">
            {selectedMethod === 'kpay'
              ? 'Required columns: email, amount. Optional: reason/description.'
              : selectedMethod === 'bank'
                ? 'Required columns: accountNumber/IBAN, amount. Optional: reason/description.'
                : 'Required columns: destination, amount. Optional: reason/description.'}
          </Typography>
        </div>
      </div>

      {/* Proceed */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleProceed}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <span>{t('transfer.proceed') || 'Proceed'}</span>
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* File Template Modal */}
      <DefaultModal
        open={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        className="!max-w-3xl"
        trigger={<></>}
        title={t('transfer.fileTemplateModalTitle') || 'File Template'}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography className="text-base font-semibold">
              {t('transfer.fileTemplateModalTitle') || 'File Template'}
            </Typography>
            <Button type="button" onClick={handleDownloadTemplate} className="px-4">
              {t('transfer.downloadTemplate') || 'Download Template'}
            </Button>
          </div>
          <Typography className="text-sm text-gray-700 mb-3">
            {t('transfer.fileTemplatePreview') || 'Preview the template below or download it:'}
          </Typography>
          <div className="overflow-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                    {selectedMethod === 'bank'
                      ? t('transfer.bankAccount') || 'Bank Account'
                      : selectedMethod === 'card'
                        ? t('transfer.destination') || 'Destination'
                        : t('transfer.receiver') || 'Receiver'}
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                    {t('transfer.amount') || 'Amount'}
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                    {t('transfer.currency') || 'Currency'}
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                    {t('transfer.note') || 'Note'}
                  </th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-700 border-b">
                    {t('transfer.paymentMethod') || 'Payment Method'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-700 border-b">
                    {selectedMethod === 'bank' ? 'DE89370400440532013000' : 'example@example.com'}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-b">100.00</td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-b">USD</td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-b">Sample Note</td>
                  <td className="px-3 py-2 text-xs text-gray-700 border-b">
                    {selectedMethod === 'kpay' ? 'K-Pay' : selectedMethod === 'bank' ? 'Bank Transfer' : 'Card'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DefaultModal>
    </div>
  );
};
