import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading invitation details...</p>
        </CardContent>
      </Card>
    </div>
  );
};
