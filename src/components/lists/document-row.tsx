'use client';

import { Button } from '@/components/ui/button';
import type { DocumentResource, DocumentIconName } from '@/types';
import { 
  Download, 
  CalendarDays, 
  File, 
  FileText, 
  FileArchive, 
  FileSpreadsheet, 
  FileImage, 
  FileVideo, 
  FileAudio,
  FileType,
  type LucideIcon 
} from 'lucide-react';
import { format } from 'date-fns';
import { track, ANALYTICS_EVENTS, type ResourceContext } from '@/lib/analytics';

interface DocumentRowProps {
  document: DocumentResource;
  trackingContext?: ResourceContext;
}

const iconMap: Record<DocumentIconName, LucideIcon> = {
  File: File,
  FileText: FileText,
  FileArchive: FileArchive,
  FileSpreadsheet: FileSpreadsheet,
  FileImage: FileImage,
  FileVideo: FileVideo,
  FileAudio: FileAudio,
  FileType: FileType,
};

export function DocumentRow({ document, trackingContext }: DocumentRowProps) {
  const IconComponent = iconMap[document.icon] || File; // Fallback to File icon if not found
  const handleDownload = () => {
    track(ANALYTICS_EVENTS.DOCUMENT_DOWNLOAD, {
      resource_id: document.id,
      resource_title: document.title,
      document_type: document.type,
      ...trackingContext,
    });
  };
  return (
    <div className="group flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-black/[0.05]">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <IconComponent className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-headline text-base font-medium tracking-tight text-foreground">{document.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>Uploaded: {format(new Date(document.uploadDate), 'MMMM d, yyyy')}</span>
            {document.fileSize && <span>&bull; {document.fileSize}</span>}
          </div>
        </div>
      </div>
      <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full text-primary hover:bg-primary hover:text-primary-foreground">
        <a href={document.downloadUrl} download={document.title} aria-label={`Download ${document.title}`} onClick={handleDownload}>
          <Download className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
