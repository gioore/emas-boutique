export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ backgroundColor: '#e5e0d8' }}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
      <div className="p-4 border-b" style={{ borderColor: '#e5e0d8', backgroundColor: '#faf7f2' }}>
        <Skeleton className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b" style={{ borderColor: '#e5e0d8' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-40' : j === cols - 1 ? 'w-20 ml-auto' : 'w-24'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
