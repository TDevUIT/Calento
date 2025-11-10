'use client';

import { GoogleCalendarConnection } from '@/components/settings/GoogleCalendarConnection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Video, MessageSquare, Users } from 'lucide-react';

export default function IntegrationsPage() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your favorite tools and services to enhance your scheduling experience
        </p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="conferencing" disabled>
            <Video className="mr-2 h-4 w-4" />
            Conferencing
          </TabsTrigger>
          <TabsTrigger value="communication" disabled>
            <MessageSquare className="mr-2 h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="crm" disabled>
            <Users className="mr-2 h-4 w-4" />
            CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <GoogleCalendarConnection />
          
          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Outlook Calendar
                  </CardTitle>
                  <CardDescription>Sync with Microsoft Outlook Calendar</CardDescription>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Coming Soon
                </span>
              </div>
            </CardHeader>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Apple Calendar
                  </CardTitle>
                  <CardDescription>Sync with iCloud Calendar</CardDescription>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Coming Soon
                </span>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="conferencing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Conferencing Tools</CardTitle>
              <CardDescription>
                Connect your video conferencing platforms (Zoom, Microsoft Teams, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Platforms</CardTitle>
              <CardDescription>
                Integrate with Slack, Discord, and other messaging platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CRM Systems</CardTitle>
              <CardDescription>
                Connect with Salesforce, HubSpot, and other CRM platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
