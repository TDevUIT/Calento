'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, Database, Server, Clock, Cpu, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHealthStatus } from '@/hook/health/use-health';

const StatusPage = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  
  const { 
    data: health, 
    isLoading: loading, 
    error,
    dataUpdatedAt 
  } = useHealthStatus(30000); // Auto-refresh every 30s

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastChecked(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const isHealthy = health?.status === 'ok' && health?.database?.connected;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time monitoring of Tempra services
                </p>
              </div>
            </div>
            {health && (
              <Badge 
                variant={isHealthy ? 'default' : 'destructive'}
                className="text-sm px-4 py-2"
              >
                {isHealthy ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    All Systems Operational
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    System Issues Detected
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !health ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading system status...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="h-5 w-5" />
                <p className="font-medium">
                  {error instanceof Error ? error.message : 'Failed to fetch system status'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : health ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Server Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-600" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">Operational</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Node.js {health?.version || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              {/* Database Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {health?.database?.connected ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">Connected</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-2xl font-bold text-red-600">Disconnected</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {health?.database?.stats?.connections || '0'} connections
                  </p>
                </CardContent>
              </Card>

              {/* Uptime */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatUptime(health?.uptime || 0)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Since last restart
                  </p>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-red-600" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatBytes(health?.memory?.heapUsed || 0)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    of {formatBytes(health?.memory?.heapTotal || 0)} heap
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    Database Statistics
                  </CardTitle>
                  <CardDescription>Database information and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database Name</span>
                      <span className="text-sm font-semibold">{health?.database?.stats?.database_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database Size</span>
                      <span className="text-sm font-semibold text-blue-600">{health?.database?.stats?.size || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Connections</span>
                      <span className="text-sm font-semibold text-green-600">{health?.database?.stats?.connections || '0'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Memory Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-red-600" />
                    Memory Usage
                  </CardTitle>
                  <CardDescription>Current memory allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">RSS (Resident Set)</span>
                      <span className="text-sm font-semibold">{formatBytes(health?.memory?.rss || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Heap Total</span>
                      <span className="text-sm font-semibold">{formatBytes(health?.memory?.heapTotal || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Heap Used</span>
                      <span className="text-sm font-semibold text-orange-600">{formatBytes(health?.memory?.heapUsed || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">External</span>
                      <span className="text-sm font-semibold">{formatBytes(health?.memory?.external || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer Info */}
            <div className="text-center text-sm text-gray-500">
              <p>Last checked: {lastChecked.toLocaleString()}</p>
              <p className="mt-1">Auto-refresh every 30 seconds</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatusPage;
