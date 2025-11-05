import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from './JsonLd';
import { generateBreadcrumbSchema } from '@/utils/seo-schema';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items,
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <div key={item.url} className="flex items-center">
              {!isFirst && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}

              {isFirst ? (
                <Link
                  href={item.url}
                  className="hover:text-blue-600 transition-colors flex items-center"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Link>
              ) : isLast ? (
                <span
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default Breadcrumb;
