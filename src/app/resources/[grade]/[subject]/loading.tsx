import { Skeleton } from "@/components/ui/skeleton";
import { Film, FileText } from "lucide-react";

export default function LoadingMaterialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Skeleton className="h-12 w-3/4 md:w-1/2 mb-4" />
        <Skeleton className="h-6 w-full md:w-3/4" />
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-2 sticky top-20">
            <div className="flex items-center bg-muted/50 p-3 rounded-md h-[50px]">
              <Film className="mr-3 h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center bg-muted/50 p-3 rounded-md h-[50px]">
              <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-5 w-28" />
            </div>
          </nav>
        </aside>

        <section className="flex-1 min-w-0">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <Skeleton className="h-40 w-full rounded-t-md" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="p-4 pt-0 flex justify-between items-center">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
