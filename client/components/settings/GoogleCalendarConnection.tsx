'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useGoogleAuth } from '@/hook/google/use-google-auth';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function GoogleCalendarConnection() {
  const queryClient = useQueryClient();
  const {
    connectionStatus,
    isConnected,
    isLoading,
    disconnect,
    error,
  } = useGoogleAuth();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Dynamic import to avoid SSR issues
      const { getAuthUrl } = await import('@/service');
      const { auth_url } = await getAuthUrl();


      // Open popup for OAuth
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        auth_url,
        'google-calendar-connect',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Monitor popup
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setIsConnecting(false);

          // Refresh connection status
          queryClient.invalidateQueries({ queryKey: ['google', 'status'] });

          toast.success('Google Calendar Connected!', {
            description: 'Your calendar is now syncing with Calento',
          });
        }
      }, 500);

      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(checkPopup);
        if (popup && !popup.closed) {
          popup.close();
        }
        setIsConnecting(false);
      }, 60000);

    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Connection Failed', {
        description: error instanceof Error ? error.message : 'Failed to connect Google Calendar',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Disconnected', {
        description: 'Google Calendar has been disconnected',
      });
    } catch (error) {
      toast.error('Disconnect Failed', {
        description: error instanceof Error ? error.message : 'Failed to disconnect',
      });
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);



      // Trigger manual sync
      const response = await fetch('/api/google/events/sync/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const result = await response.json();

      toast.success('Sync Completed!', {
        description: `Synced ${result.data?.synced || 0} events from Google Calendar`,
      });

      // Refresh events
      queryClient.invalidateQueries({ queryKey: ['events'] });

    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync Failed', {
        description: error instanceof Error ? error.message : 'Failed to sync events',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar
          </CardTitle>
          <CardDescription>Connect your Google Calendar for seamless scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Google Calendar
            </CardTitle>
            <CardDescription>Connect your Google Calendar for seamless scheduling</CardDescription>
          </div>
          {isConnected ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">
              <XCircle className="mr-1 h-3 w-3" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                {connectionStatus?.expires_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">
                      {new Date(connectionStatus.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="outline"
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>

            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium">✨ Two-way sync enabled</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Events created in Calento sync to Google Calendar</li>
                <li>• Events created in Google sync to Calento</li>
                <li>• Real-time updates via webhooks</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 text-sm font-medium">Benefits of connecting:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Two-way sync between Calento and Google Calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Automatic import of existing events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Real-time updates when you make changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Access to Google Meet integration</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Connect Google Calendar
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
