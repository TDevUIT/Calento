import { Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface InvitationFormProps {
  addToCalento: boolean;
  setAddToCalento: (value: boolean) => void;
  comment: string;
  setComment: (value: string) => void;
  isPending: boolean;
  responseStatus?: string;
}

export const InvitationForm = ({
  addToCalento,
  setAddToCalento,
  comment,
  setComment,
  isPending,
  responseStatus,
}: InvitationFormProps) => {
  return (
    <>
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6 border border-blue-100 dark:border-blue-900">
        <div className="flex items-start gap-3">
          <Checkbox
            id="addToCalento"
            checked={addToCalento}
            onCheckedChange={(checked) => setAddToCalento(!!checked)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label
              htmlFor="addToCalento"
              className="text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Add to Calento Calendar
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically sync this event to your calendar
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-medium">
          Note (optional)
        </Label>
        <Textarea
          id="comment"
          placeholder="Add a note for the organizer..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          disabled={isPending}
          className="resize-none"
        />
      </div>

      {responseStatus && responseStatus !== 'needsAction' && (
        <div className="bg-muted p-4 rounded-lg mt-6">
          <p className="text-sm text-muted-foreground">
            Current status:{' '}
            <Badge variant="secondary">
              {responseStatus === 'accepted' && 'Accepted'}
              {responseStatus === 'declined' && 'Declined'}
              {responseStatus === 'tentative' && 'Maybe'}
            </Badge>
          </p>
        </div>
      )}
    </>
  );
};
