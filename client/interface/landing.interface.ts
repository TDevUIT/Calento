// Landing Page Statistics
export interface StatItem {
  id: string;
  value: string;
  label: string;
}

// Department/Service Cards
export interface DepartmentCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  href: string;
}

// Integration Items
export interface IntegrationItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

// Enterprise Features
export interface EnterpriseFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Testimonials
export interface Testimonial {
  id: string;
  author: string;
  title: string;
  company: string;
  quote: string;
  image: string;
  companyLogo: string;
  illustration: string;
}

// Platform Integrations
export interface PlatformIntegration {
  id: string;
  name: string;
  logo: string;
  description: string;
  href: string;
}

// Timeline/Roadmap
export interface TimelinePhase {
  id: string;
  period: string;
  items: string[];
}
