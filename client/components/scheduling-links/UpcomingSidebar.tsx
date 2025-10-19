"use client";

interface UpcomingMeeting {
  name: string;
  date: string;
  email?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  phone?: string;
  notes?: string;
}

interface UpcomingSidebarProps {
  meeting: UpcomingMeeting;
}

export const UpcomingSidebar = ({ meeting }: UpcomingSidebarProps) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Upcoming</h3>
      <div className="bg-white rounded-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-semibold">
                {meeting.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-base">
                {meeting.name}
              </p>
              <p className="text-sm text-gray-600">
                {meeting.date}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
