import { cn } from '@/lib/utils';

interface BetaBadgeProps {
  variant?: 'default' | 'small' | 'header';
  className?: string;
}

export function BetaBadge({ variant = 'default', className }: BetaBadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-black text-white bg-orange-500 rounded-lg shadow-lg border border-orange-300/30 ';
  
  const variantClasses = {
    default: 'px-3 py-1.5 text-xs tracking-widest',
    small: 'px-2 py-1 text-xs tracking-wide',
    header: 'px-2.5 py-1 text-xs tracking-widest ml-3 relative -top-0.5'
  };

  return (
    <span 
      className={cn(baseClasses, variantClasses[variant], className)}
      title="Phiên bản thử nghiệm - BETA"
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      }}
    >
      BETA
    </span>
  );
}
