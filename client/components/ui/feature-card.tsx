import { cn } from '@/lib/utils';
import { CardProps } from '@/interface/components.interface';

export function FeatureCard({
  title,
  description,
  colorClass = 'bg-blue-100',
  icon,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 px-2 flex flex-col items-center shadow-md w-44 min-w-[140px] mx-2',
        colorClass,
        className
      )}
    >
      {icon ? (
        <div className="mb-2 w-full flex justify-center">{icon}</div>
      ) : (
        <div className="mb-2 w-full flex justify-center">
          <div className="rounded-xl overflow-hidden w-16 h-12 bg-white flex items-center justify-center">
            <span className="w-7 h-7 bg-gray-300 rounded-full" aria-hidden="true" />
          </div>
        </div>
      )}
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <p className="text-sm text-center">{description}</p>
    </div>
  );
}
