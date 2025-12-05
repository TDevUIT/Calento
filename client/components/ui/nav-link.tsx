'use client';
import { cn } from '@/lib/utils';
import { NavigationLinkProps } from '@/interface';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';

export function NavLink({
  label,
  href,
  hasDropdown = false,
  dropdownItems = [],
  isActive = false,
  className,
  isOpen = false,
  onOpenChange,
}: NavigationLinkProps) {
  const handleMouseEnter = () => {
    if (hasDropdown && dropdownItems.length > 0 && onOpenChange) {
      onOpenChange(label, true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown && dropdownItems.length > 0 && onOpenChange) {
      e.preventDefault();
      onOpenChange(label, !isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (hasDropdown && onOpenChange) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenChange(label, !isOpen);
      } else if (e.key === 'Escape') {
        onOpenChange(label, false);
      }
    }
  };

  const linkClasses = cn(
    'cursor-pointer transition-all duration-200 font-semibold text-base tracking-wide px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20',
    isActive 
      ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 font-bold shadow-sm' 
      : 'text-cod-gray-800 dark:text-cod-gray-200 hover:text-blue-600 dark:hover:text-blue-400',
    isOpen && 'text-blue-600 dark:text-blue-400',
    className
  );

  return (
    <div className="relative" onMouseEnter={handleMouseEnter}>
      {hasDropdown && dropdownItems.length > 0 ? (
        <DropdownMenu open={isOpen} onOpenChange={(open) => onOpenChange?.(label, open)}>
          <DropdownMenuTrigger asChild>
            <Link
              href={href}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={linkClasses}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {label}
            </Link>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {dropdownItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href={href}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={linkClasses}
        >
          {label}
        </Link>
      )}
    </div>
  );
}
