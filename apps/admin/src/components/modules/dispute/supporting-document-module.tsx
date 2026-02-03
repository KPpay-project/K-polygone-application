import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SupportingDocumentModuleProps {
  title: string;
  documentUrl?: string | null;
  className?: string;
}

const SupportingDocumentModule = ({ title, documentUrl, className }: SupportingDocumentModuleProps) => {
  return (
    <div className={cn('rounded-xl border bg-white p-4 flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
          <File className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{documentUrl ?? '—'}</div>
        </div>
      </div>

      {documentUrl ? (
        <a href={documentUrl} download target="_blank" rel="noopener noreferrer" aria-label={`Download ${title}`}>
          <Button variant="outline" size="sm">
            Download
          </Button>
        </a>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Download
        </Button>
      )}
    </div>
  );
};

export { SupportingDocumentModule };
