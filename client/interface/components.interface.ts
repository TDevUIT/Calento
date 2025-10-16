import { ReactNode } from 'react';

// Base Component Interfaces
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  id?: string;
  'aria-label'?: string;
}

export interface CardProps extends BaseComponentProps {
  title: string;
  description: string;
  colorClass?: string;
  icon?: ReactNode;
  image?: ImageProps;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export interface LinkProps {
  href: string;
  text: string;
  external?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

// Navigation Interfaces
export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavigationLinkProps {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: readonly DropdownItem[];
  isActive?: boolean;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (label: string, isOpen: boolean) => void;
}

// Integration & Badge Interfaces
export interface IntegrationBadgeProps {
  name: string;
  icon: string;
  color: string;
  variant?: 'default' | 'compact';
}

// Testimonial Interfaces
export interface TestimonialProps {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  rating?: number;
}

// Statistics Interfaces
export interface StatItemProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: ReactNode;
}

// Feature Interfaces
export interface FeatureItemProps {
  title: string;
  description: string;
  icon?: ReactNode;
  image?: ImageProps;
  link?: LinkProps;
}

// Footer Interfaces
export interface FooterSectionProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

export interface SocialLinkProps {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  href: string;
  'aria-label'?: string;
}
