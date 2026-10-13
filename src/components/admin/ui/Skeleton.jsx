import { cx } from '../utils'

export default function Skeleton({ className }) {
  return <div className={cx('animate-pulse rounded-xl bg-(--surface-2)', className)} />
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}
