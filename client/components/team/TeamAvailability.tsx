'use client';

import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// interface TeamAvailabilityProps {
//   teamId?: string;
// }

export const TeamAvailability = () => {
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Availability</CardTitle>
          <CardDescription>
            View team availability heatmap and find optimal meeting times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Availability Analytics
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This feature will show team availability heatmaps and suggest optimal meeting times
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Heatmap
              </Button>
              <Button>
                <Clock className="h-4 w-4 mr-2" />
                Find Optimal Times
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-xs text-gray-600 mt-1">Avg Availability</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">9-11 AM</div>
              <div className="text-xs text-gray-600 mt-1">Best Meeting Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600 mt-1">Timezone Spread</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
