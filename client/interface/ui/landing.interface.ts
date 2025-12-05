export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface DepartmentCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  href: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

export interface EnterpriseFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

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

export interface PlatformIntegration {
  id: string;
  name: string;
  logo: string;
  description: string;
  href: string;
}

export interface TimelinePhase {
  id: string;
  period: string;
  items: string[];
}
