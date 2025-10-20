# Contact Hooks

React hooks for contact form submission using TanStack Query.

## Hooks

### `useSubmitContact`

Submit contact form with automatic error handling and success notifications.

**Usage:**

```tsx
import { useSubmitContact } from '@/hook/contact';

function ContactPage() {
  const submitContact = useSubmitContact();

  const handleSubmit = (data) => {
    submitContact.mutate({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      country: data.country,
      inquiry_type: data.inquiryType,
      message: data.message,
      subscribe_offers: data.subscribeOffers
    }, {
      onSuccess: () => {
        console.log('Contact form submitted successfully');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={submitContact.isPending}
      >
        {submitContact.isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

**Features:**

- ✅ Automatic toast notifications on success/error
- ✅ Query invalidation after successful submission
- ✅ Loading state via `isPending`
- ✅ Error handling with descriptive messages
- ✅ Type-safe with TypeScript

**Request Interface:**

```typescript
interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
}
```

**Response Interface:**

```typescript
interface ContactResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
  status: string;
  created_at: string;
}
```

## Query Keys

```typescript
export const CONTACT_QUERY_KEYS = {
  all: ['contacts'],
  submissions: () => ['contacts', 'submission'],
};
```

## Dependencies

- `@tanstack/react-query` - For mutations and cache management
- `sonner` - For toast notifications
- `@/service/contact.service` - API service layer
