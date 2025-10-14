"use client";

import { CheckCircle2, Calendar, RefreshCw, AlertCircle, Link as LinkIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const integrations = [
  {
    id: "google",
    name: "Google Calendar",
    description: "Sync with your Google Calendar account",
    icon: "/images/integrations/google-calendar.svg",
    connected: true,
    status: "active",
    lastSync: "2 minutes ago",
    calendars: ["Work", "Personal", "Team Events"]
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Connect your Outlook calendar",
    icon: "/images/integrations/outlook.svg",
    connected: false,
    status: null,
    lastSync: null,
    calendars: []
  },
  {
    id: "apple",
    name: "Apple Calendar",
    description: "Sync with iCloud Calendar",
    icon: "/images/integrations/apple-calendar.svg",
    connected: false,
    status: null,
    lastSync: null,
    calendars: []
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Auto-add Zoom meeting links",
    icon: "/images/integrations/zoom.svg",
    connected: true,
    status: "active",
    lastSync: "5 minutes ago",
    calendars: []
  }
];

const syncHistory = [
  {
    id: "1",
    integration: "Google Calendar",
    action: "Full sync completed",
    time: "2 minutes ago",
    status: "success",
    details: "142 events synced"
  },
  {
    id: "2",
    integration: "Zoom",
    action: "Connection verified",
    time: "5 minutes ago",
    status: "success",
    details: "API credentials validated"
  },
  {
    id: "3",
    integration: "Google Calendar",
    action: "Incremental sync",
    time: "1 hour ago",
    status: "success",
    details: "3 new events added"
  },
  {
    id: "4",
    integration: "Google Calendar",
    action: "Sync attempted",
    time: "2 hours ago",
    status: "warning",
    details: "Rate limit reached, retrying..."
  }
];

const syncSettings = [
  {
    title: "Sync Frequency",
    value: "Every 15 minutes",
    description: "How often calendars are synchronized"
  },
  {
    title: "Two-way Sync",
    value: "Enabled",
    description: "Changes sync in both directions"
  },
  {
    title: "Auto-sync",
    value: "On",
    description: "Automatically sync new events"
  }
];

export default function CalendarSyncPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar Sync</h1>
          <p className="text-muted-foreground mt-1">
            Connect and sync your calendars with multiple platforms
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync All Now
        </Button>
      </div>

      {/* Sync Settings Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {syncSettings.map((setting) => (
          <Card key={setting.title}>
            <CardHeader className="pb-3">
              <CardDescription>{setting.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{setting.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {setting.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
        <div className="grid gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className={
              integration.connected 
                ? "border-green-200 dark:border-green-900/30" 
                : ""
            }>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Calendar className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {integration.name}
                        {integration.connected && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </Button>
                        <Button variant="outline" size="sm">
                          Settings
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {integration.connected && (
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-4 w-4" />
                        Last synced: {integration.lastSync}
                      </div>
                      {integration.calendars.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {integration.calendars.length} calendars
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {integration.status === "active" ? "Active" : "Inactive"}
                    </div>
                  </div>
                  {integration.calendars.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {integration.calendars.map((calendar) => (
                        <span
                          key={calendar}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {calendar}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Sync History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sync History</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {syncHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className={`p-2 rounded-lg ${
                    item.status === "success" 
                      ? "bg-green-100 dark:bg-green-900/30" 
                      : item.status === "warning"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}>
                    {item.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.action}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.integration}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Card */}
      <Card className="bg-persian-blue-50 dark:bg-persian-blue-900/20 border-persian-blue-200 dark:border-persian-blue-800">
        <CardHeader>
          <CardTitle>Need Help Syncing?</CardTitle>
          <CardDescription>
            Having trouble connecting your calendar? Check out our sync troubleshooting guide or contact support.
          </CardDescription>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm">
              View Guide
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
