import clsx from 'clsx'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-2xl border border-border bg-surface/40',
        className,
      )}
    />
  )
}
