import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() { return <div className="container content-section" aria-busy="true" aria-label="Loading content"><Skeleton className="h-12 w-2/3 mb-8"/><div className="skeleton-grid">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 rounded-xl"/>)}</div></div>; }
