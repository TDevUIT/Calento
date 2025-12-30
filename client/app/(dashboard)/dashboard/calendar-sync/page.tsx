 'use client';
 
 import { useGoogleAuth } from '@/hook/google/use-google-auth';
 import { GoogleCalendarConnection } from '@/components/settings/GoogleCalendarConnection';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 
 export default function CalendarSyncPage() {
   const { isConnected, isLoading } = useGoogleAuth();
 
   return (
     <div className="container max-w-4xl py-6 space-y-6">
       <div>
         <h1 className="text-3xl font-bold tracking-tight">Calendar Sync</h1>
         <p className="text-muted-foreground mt-2">
           Connect Google Calendar to enable syncing and Google Meet integration
         </p>
       </div>
 
       {!isLoading && !isConnected && (
         <Card>
           <CardHeader>
             <CardTitle>Google account connection required</CardTitle>
             <CardDescription>
               Please connect your Google account to create a Google Meet link
             </CardDescription>
           </CardHeader>
           <CardContent />
         </Card>
       )}
 
       <GoogleCalendarConnection />
     </div>
   );
 }
