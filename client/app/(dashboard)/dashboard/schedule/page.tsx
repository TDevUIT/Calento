"use client";

import { useState } from "react";
import { Clock, Plus, Calendar, Users, Edit, Trash2, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const scheduleLinks = [
  {
    id: "1",
    name: "30 Min Meeting",
    duration: "30 min",
    description: "Quick 30-minute meeting for brief discussions",
    url: "tempra.com/schedule/30min",
    bookings: 12,
    active: true
  },
  {
    id: "2",
    name: "1 Hour Consultation",
    duration: "60 min",
    description: "In-depth consultation for detailed planning",
    url: "tempra.com/schedule/1hour",
    bookings: 8,
    active: true
  },
  {
    id: "3",
    name: "Coffee Chat",
    duration: "15 min",
    description: "Informal coffee chat or quick catch-up",
    url: "tempra.com/schedule/coffee",
    bookings: 24,
    active: true
  },
  {
    id: "4",
    name: "Team Workshop",
    duration: "2 hours",
    description: "Extended workshop session for team collaboration",
    url: "tempra.com/schedule/workshop",
    bookings: 3,
    active: false
  }
];

const upcomingMeetings = [
  {
    id: "1",
    title: "Product Demo",
    date: "Oct 15, 2025",
    time: "10:00 AM",
    attendee: "Sarah Johnson",
    type: "30 Min Meeting"
  },
  {
    id: "2",
    title: "Strategy Session",
    date: "Oct 15, 2025",
    time: "2:30 PM",
    attendee: "Michael Chen",
    type: "1 Hour Consultation"
  },
  {
    id: "3",
    title: "Quick Sync",
    date: "Oct 16, 2025",
    time: "9:00 AM",
    attendee: "Emily Davis",
    type: "Coffee Chat"
  }
];

const stats = [
  { label: "Active Links", value: "3", icon: Calendar },
  { label: "Total Bookings", value: "47", icon: Users },
  { label: "This Week", value: "12", icon: Clock }
];

export default function SchedulePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your scheduling links
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduling Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Scheduling Links</h2>
        <div className="grid gap-4">
          {scheduleLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{link.name}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.active 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {link.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <CardDescription className="mt-1">
                      {link.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {link.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {link.bookings} bookings
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-sm bg-muted px-3 py-1 rounded">
                      {link.url}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyLink(link.url, link.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedId === link.id ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div
                  key={meeting.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index !== upcomingMeetings.length - 1 ? "mb-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-persian-blue-100 dark:bg-persian-blue-900/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-persian-blue-600 dark:text-persian-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        with {meeting.attendee} • {meeting.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{meeting.date}</p>
                    <p className="text-sm text-muted-foreground">{meeting.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
