import clsx from 'clsx'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-3xl border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12),rgba(255,255,255,0.06))] bg-[length:200%_100%]',
        className,
      )}
    />
  )
}
