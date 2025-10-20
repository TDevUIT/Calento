'use client';

import { useState } from 'react';
import { 
  HelpCircle, MessageSquare, 
  FileText, Calendar, Video, Search, 
  ChevronRight, ExternalLink, CheckCircle2,
  Zap, Users, Shield, LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface HelpCategory {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  articles: {
    title: string;
    description: string;
    href: string;
  }[];
}

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      icon: Zap,
      title: 'Getting Started',
      description: 'Learn the basics of using Tempra',
      color: 'blue',
      articles: [
        {
          title: 'Quick Start Guide',
          description: 'Get up and running with Tempra in 5 minutes',
          href: '#quick-start',
        },
        {
          title: 'Creating Your First Event',
          description: 'Step-by-step guide to create and manage events',
          href: '#first-event',
        },
        {
          title: 'Setting Up Integrations',
          description: 'Connect Google Calendar, Slack, and more',
          href: '#integrations',
        },
        {
          title: 'Dashboard Overview',
          description: 'Understanding your Tempra dashboard',
          href: '#dashboard',
        },
      ],
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Calendar & Events',
      description: 'Manage your calendar and events',
      color: 'purple',
      articles: [
        {
          title: 'Calendar Views',
          description: 'Day, week, month, and year views explained',
          href: '#calendar-views',
        },
        {
          title: 'Recurring Events',
          description: 'Create and manage recurring events',
          href: '#recurring',
        },
        {
          title: 'Event Invitations',
          description: 'Invite attendees and manage RSVPs',
          href: '#invitations',
        },
        {
          title: 'AI-Powered Scheduling',
          description: 'Let AI find the best meeting times',
          href: '#ai-scheduling',
        },
      ],
    },
    {
      id: 'scheduling',
      icon: Video,
      title: 'Scheduling & Booking',
      description: 'Share your availability and book meetings',
      color: 'green',
      articles: [
        {
          title: 'Creating Booking Links',
          description: 'Share your availability with custom links',
          href: '#booking-links',
        },
        {
          title: 'Managing Bookings',
          description: 'Accept, reschedule, or cancel bookings',
          href: '#manage-bookings',
        },
        {
          title: 'Availability Settings',
          description: 'Set your working hours and buffer times',
          href: '#availability',
        },
        {
          title: 'Custom Booking Pages',
          description: 'Personalize your booking page',
          href: '#custom-pages',
        },
      ],
    },
    {
      id: 'tasks',
      icon: CheckCircle2,
      title: 'Tasks & Priorities',
      description: 'Organize your work and priorities',
      color: 'orange',
      articles: [
        {
          title: 'Task Management',
          description: 'Create, organize, and track tasks',
          href: '#tasks',
        },
        {
          title: 'Priority Board',
          description: 'Manage priorities with drag-and-drop',
          href: '#priorities',
        },
        {
          title: 'Due Dates & Reminders',
          description: 'Never miss a deadline',
          href: '#reminders',
        },
        {
          title: 'Task Analytics',
          description: 'Track productivity and completion rates',
          href: '#task-analytics',
        },
      ],
    },
    {
      id: 'collaboration',
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work better together',
      color: 'pink',
      articles: [
        {
          title: 'Team Calendars',
          description: 'Share calendars with your team',
          href: '#team-calendars',
        },
        {
          title: 'Round Robin Scheduling',
          description: 'Distribute meetings across team members',
          href: '#round-robin',
        },
        {
          title: 'Shared Booking Links',
          description: 'Create team booking pages',
          href: '#team-booking',
        },
        {
          title: 'Meeting Analytics',
          description: 'Team meeting insights and metrics',
          href: '#team-analytics',
        },
      ],
    },
    {
      id: 'integrations',
      icon: Zap,
      title: 'Integrations',
      description: 'Connect your favorite tools',
      color: 'indigo',
      articles: [
        {
          title: 'Google Calendar Sync',
          description: 'Two-way sync with Google Calendar',
          href: '#google-calendar',
        },
        {
          title: 'Slack Integration',
          description: 'Get notifications in Slack',
          href: '#slack',
        },
        {
          title: 'Email Notifications',
          description: 'Configure email alerts',
          href: '#email',
        },
        {
          title: 'API Documentation',
          description: 'Build custom integrations',
          href: '#api',
        },
      ],
    },
  ];

  const faqs = [
    {
      question: 'How do I connect my Google Calendar?',
      answer: 'Go to Settings > Integrations > Google Calendar and click "Connect". You\'ll be redirected to Google to authorize access.',
    },
    {
      question: 'Can I use Tempra for free?',
      answer: 'Yes! Tempra offers a free plan with core features. Premium plans unlock advanced features like team collaboration and analytics.',
    },
    {
      question: 'How does AI scheduling work?',
      answer: 'Our AI analyzes your calendar patterns, preferences, and availability to suggest optimal meeting times for all participants.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, secure authentication, and follow industry best practices for data protection.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export all your events, tasks, and bookings as CSV or JSON files from Settings > Data Export.',
    },
  ];

  const quickLinks = [
    { icon: FileText, label: 'Documentation', href: '#docs' },
    { icon: MessageSquare, label: 'Contact Support', href: '/contact' },
    { icon: Shield, label: 'Privacy Policy', href: '#privacy' },
    { icon: ExternalLink, label: 'API Reference', href: '#api' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-xl text-blue-100 mb-8">
              Search our help center or browse categories below
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex items-center gap-3"
            >
              <link.icon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                      <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.articles.map((article, index) => (
                      <li key={index}>
                        <Link
                          href={article.href}
                          className="group flex items-start gap-2 text-sm hover:text-blue-600 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4 mt-0.5 text-gray-400 group-hover:text-blue-600" />
                          <div>
                            <p className="font-medium">{article.title}</p>
                            <p className="text-xs text-gray-500">{article.description}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
