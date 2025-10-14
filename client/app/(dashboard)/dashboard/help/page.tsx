"use client";

import { useState } from "react";
import { 
  Search, 
  Calendar, 
  Users, 
  Settings, 
  Mail, 
  MessageSquare, 
  Video, 
  FileText,
  ExternalLink,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const popularTopics = [
  {
    icon: Calendar,
    title: "Getting Started",
    description: "Learn the basics of Tempra",
    href: "#getting-started"
  },
  {
    icon: Users,
    title: "Calendar Sync",
    description: "Connect Google Calendar & more",
    href: "#calendar-sync"
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Configure your preferences",
    href: "#settings"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Keep your data safe",
    href: "#privacy"
  }
];

const contactOptions = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    action: "support@tempra.com",
    href: "mailto:support@tempra.com"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our team",
    action: "Start Chat",
    href: "#chat"
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Browse our guides",
    action: "View Docs",
    href: "#docs"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch how-to videos",
    action: "Watch Videos",
    href: "#videos"
  }
];

const faqs = [
  {
    question: "How do I connect my Google Calendar?",
    answer: "Go to Settings > Integrations, click 'Connect Google Calendar', and follow the authorization prompts. Your calendars will sync automatically."
  },
  {
    question: "How do I create a new event?",
    answer: "Click the '+' button in the top right of the calendar view, or press 'C' on your keyboard. Fill in the event details and click 'Create Event'."
  },
  {
    question: "Can I sync multiple calendars?",
    answer: "Yes! You can connect multiple Google Calendar accounts and other calendar providers. Go to Settings > Integrations to add more connections."
  },
  {
    question: "How do I share my calendar with others?",
    answer: "Open the calendar settings, click 'Share', and enter the email addresses of people you want to share with. You can set different permission levels for each person."
  },
  {
    question: "Is my calendar data secure?",
    answer: "Absolutely! We use industry-standard encryption for all data transmission and storage. Your calendar data is private and only accessible by you and people you explicitly share with."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "Go to Settings > Billing, click 'Manage Subscription', and select 'Cancel Subscription'. Your access will continue until the end of your billing period."
  },
  {
    question: "Can I export my calendar data?",
    answer: "Yes! Go to Settings > Data & Privacy, and click 'Export Data'. You can download your calendar data in iCal (.ics) format."
  },
  {
    question: "What are keyboard shortcuts?",
    answer: "Press '?' on your keyboard to view all available shortcuts. Common ones include 'C' to create event, 'T' for today, and arrow keys for navigation."
  }
];


export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Help & Support Center</h1>
        <p className="text-muted-foreground text-lg">
          Find answers, learn how to use Tempra, and get in touch with our support team
        </p>
      </div>

      <Card className="border-2 border-black dark:border-white">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTopics.map((topic) => (
            <Card key={topic.title} className="border-2 border-black dark:border-white hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-persian-blue-100 dark:bg-persian-blue-900/30 rounded-lg">
                    <topic.icon className="h-5 w-5 text-persian-blue-600 dark:text-persian-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm">{topic.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {topic.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactOptions.map((option) => (
            <Card key={option.title} className="border-2 border-black dark:border-white hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-persian-blue-100 dark:bg-persian-blue-900/30 rounded-full">
                    <option.icon className="h-6 w-6 text-persian-blue-600 dark:text-persian-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm mb-1">{option.title}</CardTitle>
                    <CardDescription className="text-xs mb-3">
                      {option.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      asChild
                    >
                      <a href={option.href}>
                        {option.action}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Card className="border-2 border-black dark:border-white">
          <CardContent className="pt-6">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No FAQs found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    
    </div>
  );
}
