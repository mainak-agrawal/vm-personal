import { Button } from '@/components/ui/button';
import type { DocumentResource } from '@/types';
import { Download, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentRowProps {
  document: DocumentResource;
}

export function DocumentRow({ document }: DocumentRowProps) {
  const IconComponent = document.icon;
  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-secondary/50 transition-colors duration-200 rounded-md">
      <div className="flex items-center gap-4">
        <IconComponent className="h-8 w-8 text-primary shrink-0" />
        <div>
          <h3 className="text-md font-semibold text-foreground">{document.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <CalendarDays className="h-3 w-3" />
            <span>Uploaded: {format(new Date(document.uploadDate), 'MMMM d, yyyy')}</span>
            {document.fileSize && <span>&bull; {document.fileSize}</span>}
          </div>
        </div>
      </div>
      <Button asChild variant="ghost" size="icon" className="text-accent hover:bg-accent/10 hover:text-accent">
        <a href={document.downloadUrl} download={document.title} aria-label={`Download ${document.title}`}>
          <Download className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
