"use client";

import { useState } from "react";
import { Video, Calendar, Clock, MapPin, Users, ExternalLink, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MeetingStatus = "upcoming" | "past" | "all";

const meetings = [
  {
    id: "1",
    title: "Product Strategy Meeting",
    date: "Oct 15, 2025",
    time: "10:00 AM - 11:00 AM",
    attendees: ["Sarah Johnson", "Michael Chen", "Emily Davis"],
    type: "video",
    platform: "Zoom",
    link: "https://zoom.us/j/123456789",
    status: "upcoming",
    description: "Discuss Q4 product roadmap and feature prioritization"
  },
  {
    id: "2",
    title: "Client Presentation",
    date: "Oct 15, 2025",
    time: "2:00 PM - 3:00 PM",
    attendees: ["John Smith", "Lisa Anderson"],
    type: "video",
    platform: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    status: "upcoming",
    description: "Present new design concepts to client"
  },
  {
    id: "3",
    title: "Team Standup",
    date: "Oct 16, 2025",
    time: "9:00 AM - 9:30 AM",
    attendees: ["Alex Wong", "Maria Garcia", "Tom Wilson", "Sarah Johnson"],
    type: "video",
    platform: "Zoom",
    link: "https://zoom.us/j/987654321",
    status: "upcoming",
    description: "Daily team sync and progress updates"
  },
  {
    id: "4",
    title: "Design Review",
    date: "Oct 16, 2025",
    time: "3:00 PM - 4:00 PM",
    attendees: ["Emily Davis", "Robert Lee"],
    type: "inPerson",
    location: "Conference Room B",
    status: "upcoming",
    description: "Review UI/UX designs for mobile app"
  },
  {
    id: "5",
    title: "Quarterly Planning",
    date: "Oct 12, 2025",
    time: "10:00 AM - 12:00 PM",
    attendees: ["Sarah Johnson", "Michael Chen", "David Park"],
    type: "video",
    platform: "Zoom",
    link: "https://zoom.us/j/111222333",
    status: "past",
    description: "Q4 planning and goal setting session"
  }
];

const stats = [
  { label: "This Week", value: "12", icon: Calendar },
  { label: "This Month", value: "47", icon: Users },
  { label: "Total Hours", value: "32.5", icon: Clock }
];

export default function MeetingsPage() {
  const [filter, setFilter] = useState<MeetingStatus>("upcoming");

  const filteredMeetings = meetings.filter(meeting => 
    filter === "all" ? true : meeting.status === filter
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your meetings and video calls
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      meeting.type === "video" 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-purple-100 dark:bg-purple-900/30"
                    }`}>
                      {meeting.type === "video" ? (
                        <Video className={`h-5 w-5 ${
                          meeting.type === "video" 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-purple-600 dark:text-purple-400"
                        }`} />
                      ) : (
                        <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {meeting.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{meeting.description}</CardDescription>
                </div>
                {meeting.status === "upcoming" && (
                  <div className="flex gap-2">
                    {meeting.type === "video" && meeting.link && (
                      <Button asChild size="sm">
                        <a href={meeting.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Join {meeting.platform}
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {meeting.attendees.length} attendees
                  </div>
                  {meeting.type === "video" && meeting.platform && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                      {meeting.platform}
                    </span>
                  )}
                  {meeting.type === "inPerson" && meeting.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {meeting.location}
                    </div>
                  )}
                </div>
                <div className="flex -space-x-2">
                  {meeting.attendees.slice(0, 3).map((attendee, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-persian-blue-100 dark:bg-persian-blue-900/30 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-persian-blue-700 dark:text-persian-blue-400"
                      title={attendee}
                    >
                      {attendee.split(" ").map(n => n[0]).join("")}
                    </div>
                  ))}
                  {meeting.attendees.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{meeting.attendees.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No {filter} meetings</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "upcoming" 
                ? "You don't have any upcoming meetings scheduled."
                : "No meetings found for this filter."}
            </p>
            {filter === "upcoming" && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Your First Meeting
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
