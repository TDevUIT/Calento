import { cn } from '@/lib/utils';
import { IntegrationBadgeProps } from '@/interface/components.interface';

export function IntegrationBadge({
  name,
  icon,
  color,
  variant = 'default',
}: IntegrationBadgeProps) {
  return (
    <div
      className={cn(
        'bg-blue-100 text-blue-700 rounded-lg font-semibold flex items-center gap-1',
        variant === 'default' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      )}
    >
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <rect width="20" height="20" rx="4" fill={color} />
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="bold"
          dy=".3em"
        >
          {icon}
        </text>
      </svg>
      <span>{name}</span>
    </div>
  );
}
