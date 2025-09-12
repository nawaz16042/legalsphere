import { ScaleIcon } from '@/components/icons/ScaleIcon';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ScaleIcon className="h-6 w-6 text-primary" />
      <span className="text-xl font-semibold text-primary">
        LegalSphere
      </span>
    </div>
  );
}
