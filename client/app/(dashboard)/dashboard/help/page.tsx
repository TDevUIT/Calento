export default function HelpPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <p className="text-muted-foreground">
        Find answers to common questions and get support for your account.
      </p>
      
      <div className="mt-6 space-y-4">
        <section>
          <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>How to connect your Google Calendar</li>
            <li>Setting up your first event</li>
            <li>Customizing your profile</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at support@tempra.com
          </p>
        </section>
      </div>
    </div>
  );
}
