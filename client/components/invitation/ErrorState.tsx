import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const ErrorState = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Invalid Invitation</h2>
          <p className="text-muted-foreground mb-6">
            This invitation may have expired or does not exist.
          </p>
          <Button onClick={() => router.push('/dashboard/calendar')}>
            Go to Calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
