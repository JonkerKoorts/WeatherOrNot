import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function WeatherSkeleton() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Search skeleton */}
      <Skeleton className="mx-auto h-10 w-full max-w-md" />

      {/* Main weather card skeleton */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <Skeleton className="mx-auto mb-6 h-5 w-64" />
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-col items-center">
              <Skeleton className="h-16 w-36 md:h-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-38" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-34" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day tiles skeleton */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[0, 1].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((tile) => (
                <Card key={tile}>
                  <CardContent className="flex flex-col items-center gap-2 p-4">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
