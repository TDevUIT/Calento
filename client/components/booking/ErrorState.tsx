import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title: string;
  message: string;
  variant?: 'error' | 'warning';
}

export const ErrorState = ({ title, message, variant = 'error' }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className={`text-2xl font-bold mb-4 ${variant === 'error' ? 'text-red-600' : 'text-orange-600'}`}>
              {title}
            </h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
