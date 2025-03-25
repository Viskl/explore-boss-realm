
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingView = () => (
  <div className="min-h-screen bg-background px-6 py-8 max-w-lg mx-auto">
    <header className="mb-8">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-60" />
    </header>
    
    <div className="mb-8 flex items-center">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="ml-4 space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    <section className="mb-8">
      <Skeleton className="h-6 w-24 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </section>
    
    <section className="mb-8">
      <Skeleton className="h-6 w-24 mb-4" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg mb-2" />
      <Skeleton className="h-14 rounded-lg" />
    </section>
    
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export default LoadingView;
