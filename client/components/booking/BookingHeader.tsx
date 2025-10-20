import { Pencil } from 'lucide-react';
import Image from 'next/image';

interface BookingHeaderProps {
  currentUser?: {
    id: string;
    avatar?: string;
    username?: string;
    email?: string;
  } | null;
  bookingUser?: {
    avatar?: string;
    full_name?: string;
    username?: string;
    email?: string;
  };
  bookingTitle: string;
  isOwner: boolean;
  onEditClick: () => void;
}

export const BookingHeader = ({ currentUser, bookingUser, bookingTitle, isOwner, onEditClick }: BookingHeaderProps) => {
  const getUserDisplay = () => {
    return bookingUser?.full_name || bookingUser?.username || bookingUser?.email || 'User';
  };

  const getUserInitial = () => {
    return (bookingUser?.full_name || bookingUser?.username || bookingUser?.email || bookingTitle)?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <>
      {currentUser && (
        <div className="flex items-center justify-between mb-6">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            {currentUser.avatar ? (
              <Image src={currentUser.avatar} alt={currentUser.username || 'User'} width={32} height={32} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {currentUser.username?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">Back to Dashboard</span>
          </a>
          {isOwner && (
            <button
              onClick={onEditClick}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>
      )}

      <div className="text-center mb-6">
        {bookingUser?.avatar ? (
          <Image
            src={bookingUser.avatar}
            alt={getUserDisplay()}
            width={48}
            height={48}
            className="w-12 h-12 mx-auto rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
            {getUserInitial()}
          </div>
        )}
        <div className="mt-3">
          <div className="text-sm text-muted-foreground">{getUserDisplay()}&apos;s Booking Page</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{bookingTitle}</h1>
          <div className="text-sm text-muted-foreground">
            with {bookingUser?.full_name || bookingUser?.username || bookingUser?.email?.split('@')[0] || 'User'}
          </div>
        </div>
      </div>
    </>
  );
};
