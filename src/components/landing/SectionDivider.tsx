import { cn } from '@/lib/utils';

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn('w-full flex justify-center py-2', className)}>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
