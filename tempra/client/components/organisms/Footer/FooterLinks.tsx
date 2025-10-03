import { FooterSection } from './FooterSection';
import { Logo } from '@/components/ui/logo';

interface FooterSectionData {
    title: string;
    links: string[];
    isWide?: boolean;
}

const footerSections: FooterSectionData[] = [
    {
        title: "Features",
        links: [
            "AI Scheduling", "Calendar Sync", "Smart Meetings", "Focus Time",
            "Time Blocking", "Meeting Analytics", "Productivity Insights",
            "Calendar Integration", "Automated Scheduling", "Team Coordination"
        ],
        isWide: true
    },
    {
        title: "Use Cases",
        links: [
            "Remote Teams", "Executives", "Sales Teams", "Marketing Teams",
            "Engineering Teams", "Consultants", "Freelancers"
        ]
    },
    {
        title: "Pricing",
        links: [
            "Pricing Plans", "Free Plan", "Pro Plan", "Team Plan",
            "Enterprise", "Student Discount"
        ]
    },
    {
        title: "Compare",
        links: [
            "Calento vs. Calendly", "Calento vs. Motion", "Calento vs. Clockwise",
            "Calento vs. Google Calendar", "Calento vs. Outlook"
        ]
    },
    {
        title: "Integrations",
        links: [
            "Google Calendar", "Outlook", "Slack", "Zoom", "Microsoft Teams",
            "Notion", "Trello", "Asana", "Linear"
        ]
    },
    {
        title: "Company",
        links: [
            "Contact Sales", "Contact Support", "About", "Careers",
            "Customers", "Affiliate program"
        ]
    },
    {
        title: "Resources",
        links: [
            "Blog", "Glossary", "Webinars & demos", "Help docs"
        ]
    }
];

const socialPlatforms = [
    {
        name: "Twitter",
        href: "#",
        color: "hover:bg-[#1DA1F2] hover:text-white",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: "LinkedIn",
        href: "#",
        color: "hover:bg-[#0A66C2] hover:text-white",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        )
    },
    {
        name: "YouTube",
        href: "#",
        color: "hover:bg-[#FF0000] hover:text-white",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        )
    },
    {
        name: "Instagram",
        href: "#",
        color: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        )
    },
    {
        name: "Facebook",
        href: "#",
        color: "hover:bg-[#1877F2] hover:text-white",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        )
    }
];

export const FooterLinks: React.FC = () => {
    return (
        <div className="w-full bg-gradient-to-b from-cod-gray-50 to-cod-gray-100 dark:from-cod-gray-900 dark:to-cod-gray-800 py-16 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Logo & Description Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Logo size="lg" />
                    </div>
                    <p className="text-cod-gray-700 dark:text-cod-gray-300 max-w-xl mx-auto mb-8 font-medium transition-colors duration-300">
                        AI-powered calendar assistant helping professionals reclaim time and boost productivity
                    </p>
                    
                    {/* Social Links with Bright Colors */}
                    <div className="flex justify-center gap-3 mb-4">
                        {socialPlatforms.map((platform) => (
                            <a
                                key={platform.name}
                                href={platform.href}
                                className={`p-3 bg-white dark:bg-cod-gray-700 text-cod-gray-700 dark:text-cod-gray-300 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-cod-gray-200 dark:border-cod-gray-600 hover:border-transparent ${platform.color}`}
                                aria-label={platform.name}
                                title={platform.name}
                            >
                                {platform.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-cod-gray-600 dark:text-cod-gray-400 font-medium transition-colors duration-300">Follow us for updates and tips</p>
                </div>

                {/* Desktop Footer Grid */}
                <div className="hidden lg:grid grid-cols-7 gap-8">
                    {footerSections.map((section) => (
                        <FooterSection
                            key={section.title}
                            title={section.title}
                            links={section.links}
                        />
                    ))}
                </div>

                {/* Mobile Footer */}
                <div className="lg:hidden space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        {footerSections.slice(0, 4).map((section) => (
                            <FooterSection
                                key={section.title}
                                title={section.title}
                                links={section.links.slice(0, 5)}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {footerSections.slice(4).map((section) => (
                            <FooterSection
                                key={section.title}
                                title={section.title}
                                links={section.links.slice(0, 5)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};