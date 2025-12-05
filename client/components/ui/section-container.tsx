import { cn } from '@/lib/utils';
import { SectionProps } from '@/interface';

interface SectionContainerProps extends SectionProps {
  as?: 'section' | 'div' | 'article';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
}

const maxWidthClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'w-full',
};

const paddingClasses = {
  none: '',
  sm: 'py-8 px-4',
  md: 'py-12 px-6',
  lg: 'py-16 px-8',
  xl: 'py-20 px-10',
};

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  gradient: 'bg-gradient-to-br from-blue-50 via-green-50 to-purple-50',
  transparent: 'bg-transparent',
};

export function SectionContainer({
  as: Component = 'section',
  maxWidth = 'xl',
  padding = 'lg',
  background = 'white',
  className,
  children,
  id,
  'aria-label': ariaLabel,
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'w-full',
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </Component>
  );
}
