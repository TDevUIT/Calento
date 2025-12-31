export const SwaggerExamples = {
  Auth: {
    Register: {
      request: {
        email: 'john.doe@example.com',
        username: 'johndoe123',
        password: 'SecurePass123!',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'https://example.com/avatars/john-doe.jpg',
      },
      response: {
        success: true,
        message: 'User registered successfully',
        data: {
          tokens: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNTQ4MzIwMCwiZXhwIjoxNzA1NDg2ODAwfQ.example-signature',
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MDU0ODMyMDAsImV4cCI6MTcwNjA4ODAwMH0.example-refresh-signature',
            token_type: 'Bearer',
            expires_in: 3600,
          },
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'john.doe@example.com',
            username: 'johndoe123',
            first_name: 'John',
            last_name: 'Doe',
            full_name: 'John Doe',
            avatar: 'https://example.com/avatars/john-doe.jpg',
            is_verified: false,
            is_active: true,
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T08:00:00Z',
          },
          login_at: '2024-01-15T10:00:00Z',
        },
        statusCode: 201,
      },
    },
    Login: {
      request: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      },
      response: {
        success: true,
        message: 'User logged in successfully',
        data: {
          tokens: {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNTQ4MzIwMCwiZXhwIjoxNzA1NDg2ODAwfQ.example-signature',
            refresh_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lMTIzIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MDU0ODMyMDAsImV4cCI6MTcwNjA4ODAwMH0.example-refresh-signature',
            token_type: 'Bearer',
            expires_in: 3600,
          },
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'john.doe@example.com',
            username: 'johndoe123',
            first_name: 'John',
            last_name: 'Doe',
            full_name: 'John Doe',
            avatar: 'https://example.com/avatars/john-doe.jpg',
            is_verified: true,
            is_active: true,
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
          login_at: '2024-01-15T10:00:00Z',
        },
        statusCode: 200,
      },
    },
    CurrentUser: {
      response: {
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'john.doe@example.com',
          username: 'johndoe123',
          first_name: 'John',
          last_name: 'Doe',
          full_name: 'John Doe',
          avatar: 'https://example.com/avatars/john-doe.jpg',
          is_verified: true,
          is_active: true,
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        statusCode: 200,
      },
    },
  },

  // Events Examples
  Events: {
    Create: {
      request: {
        title: 'Team Sprint Planning',
        description:
          'Planning session for the upcoming sprint. We will discuss user stories, estimate tasks, and set sprint goals.',
        start_time: '2024-01-22T09:00:00Z',
        end_time: '2024-01-22T11:00:00Z',
        location: 'Conference Room A - Building 1',
        is_all_day: false,
        recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO;COUNT=4',
      },
      response: {
        success: true,
        message: 'Event created successfully',
        data: {
          id: '456e7890-e89b-12d3-a456-426614174001',
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Team Sprint Planning',
          description:
            'Planning session for the upcoming sprint. We will discuss user stories, estimate tasks, and set sprint goals.',
          start_time: '2024-01-22T09:00:00Z',
          end_time: '2024-01-22T11:00:00Z',
          location: 'Conference Room A - Building 1',
          is_all_day: false,
          recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO;COUNT=4',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
        },
        statusCode: 201,
      },
    },
    List: {
      query: {
        page: 1,
        limit: 10,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-01-31T23:59:59Z',
        search: 'meeting',
        location: 'Conference Room',
        is_all_day: false,
      },
      response: {
        success: true,
        message: 'Events retrieved successfully',
        data: [
          {
            id: '456e7890-e89b-12d3-a456-426614174001',
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Team Sprint Planning',
            description: 'Planning session for the upcoming sprint',
            start_time: '2024-01-22T09:00:00Z',
            end_time: '2024-01-22T11:00:00Z',
            location: 'Conference Room A',
            is_all_day: false,
            recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO;COUNT=4',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
          },
          {
            id: '789e1234-e89b-12d3-a456-426614174002',
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Client Meeting',
            description: 'Quarterly business review with key client',
            start_time: '2024-01-25T14:00:00Z',
            end_time: '2024-01-25T15:30:00Z',
            location: 'Conference Room B',
            is_all_day: false,
            recurrence_rule: null,
            created_at: '2024-01-20T08:15:00Z',
            updated_at: '2024-01-20T08:15:00Z',
          },
        ],
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
        },
        statusCode: 200,
      },
    },
  },

  Users: {
    Create: {
      request: {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password_hash: '$2b$10$example.hash.for.password',
        first_name: 'Jane',
        last_name: 'Smith',
      },
      response: {
        success: true,
        message: 'User created successfully',
        data: {
          id: '789e1234-e89b-12d3-a456-426614174002',
          email: 'jane.smith@example.com',
          username: 'janesmith',
          first_name: 'Jane',
          last_name: 'Smith',
          is_verified: false,
          is_active: true,
          created_at: '2024-01-15T11:00:00Z',
          updated_at: '2024-01-15T11:00:00Z',
        },
        statusCode: 201,
      },
    },
    List: {
      query: {
        page: 1,
        limit: 10,
        search: 'john',
        is_active: true,
      },
      response: {
        success: true,
        message: 'Users retrieved successfully',
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'john.doe@example.com',
            username: 'johndoe123',
            first_name: 'John',
            last_name: 'Doe',
            is_verified: true,
            is_active: true,
            created_at: '2024-01-15T08:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
          {
            id: '789e1234-e89b-12d3-a456-426614174002',
            email: 'jane.smith@example.com',
            username: 'janesmith',
            first_name: 'Jane',
            last_name: 'Smith',
            is_verified: false,
            is_active: true,
            created_at: '2024-01-15T11:00:00Z',
            updated_at: '2024-01-15T11:00:00Z',
          },
        ],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        statusCode: 200,
      },
    },
  },

  Errors: {
    Unauthorized: {
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      statusCode: 401,
    },
    Forbidden: {
      error: 'Forbidden',
      message: 'Insufficient permissions',
      statusCode: 403,
    },
    NotFound: {
      error: 'Not Found',
      message: 'Resource not found',
      statusCode: 404,
    },
    ValidationError: {
      error: 'Bad Request',
      message: 'Validation failed',
      details: [
        {
          field: 'email',
          message: 'Please provide a valid email address',
        },
        {
          field: 'password',
          message:
            'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
        },
      ],
      statusCode: 400,
    },
    InternalServerError: {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      statusCode: 500,
    },
  },

  AI: {
    Chat: {
      request: {
        message: 'Schedule a meeting with John tomorrow at 2pm',
        context: {
          timezone: 'America/New_York',
          current_time: '2024-01-15T10:00:00Z',
        },
      },
      response: {
        id: 'msg-12345',
        content: 'I have scheduled the meeting with John for tomorrow at 2 PM.',
        role: 'assistant',
        created_at: '2024-01-15T10:00:05Z',
        usage: {
          prompt_tokens: 50,
          completion_tokens: 20,
          total_tokens: 70,
        },
      },
    },
    Stream: {
      response: {
        event: 'text',
        data: {
          content: 'I am processing your request...',
        },
      },
    },
    Conversations: {
      List: {
        response: [
          {
            id: 'conv-123',
            title: 'Meeting Scheduling',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:05:00Z',
            user_id: 'user-123',
          },
          {
            id: 'conv-456',
            title: 'Project Planning',
            created_at: '2024-01-14T15:00:00Z',
            updated_at: '2024-01-14T15:30:00Z',
            user_id: 'user-123',
          },
        ],
      },
      Details: {
        response: {
          id: 'conv-123',
          title: 'Meeting Scheduling',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:05:00Z',
          messages: [
            {
              id: 'msg-1',
              role: 'user',
              content: 'Schedule a meeting',
              created_at: '2024-01-15T10:00:00Z',
            },
            {
              id: 'msg-2',
              role: 'assistant',
              content: 'When would you like to meet?',
              created_at: '2024-01-15T10:00:02Z',
            },
          ],
        },
      },
    },
    ConfirmAction: {
      request: {
        action_id: 'action-123',
        conversation_id: 'conv-123',
        confirmed: true,
        modified_parameters: {},
      },
      response: {
        success: true,
        message: 'Action confirmed',
        data: {
          status: 'executed',
          result: {
            event_id: 'evt-123',
            status: 'confirmed',
          },
        },
      },
    },
  },

  RAG: {
    Context: {
      Add: {
        request: {
          context: {
            user_preference: 'Prefer morning meetings',
            role: 'Software Engineer',
          },
        },
        response: {
          success: true,
          data: {
            id: 'ctx-123',
            user_id: 'user-123',
            content: {
              user_preference: 'Prefer morning meetings',
              role: 'Software Engineer',
            },
            created_at: '2024-01-15T10:00:00Z',
          },
        },
      },
      List: {
        response: {
          success: true,
          data: [
            {
              id: 'ctx-123',
              user_id: 'user-123',
              content: {
                user_preference: 'Prefer morning meetings',
                role: 'Software Engineer',
              },
              created_at: '2024-01-15T10:00:00Z',
            },
          ],
        },
      },
      Delete: {
        response: {
          success: true,
          message: 'Context deleted successfully',
        },
      },
    },
  },

  Availability: {
    Rule: {
      response: {
        id: 'avail-123',
        user_id: 'user-123',
        name: 'Work Hours',
        days: [1, 2, 3, 4, 5],
        start_time: '09:00',
        end_time: '17:00',
        timezone: 'America/New_York',
        is_active: true,
      },
    },
    List: {
      response: [
        {
          id: 'avail-123',
          user_id: 'user-123',
          name: 'Work Hours',
          days: [1, 2, 3, 4, 5],
          start_time: '09:00',
          end_time: '17:00',
          timezone: 'America/New_York',
          is_active: true,
        },
      ],
    },
    Schedule: {
      response: {
        Monday: [
          { start: '09:00', end: '17:00', name: 'Work Hours' }
        ],
        Tuesday: [
          { start: '09:00', end: '17:00', name: 'Work Hours' }
        ],
      },
    },
    Slots: {
      response: [
        { start: '2024-01-22T09:00:00Z', end: '2024-01-22T09:30:00Z', available: true },
        { start: '2024-01-22T09:30:00Z', end: '2024-01-22T10:00:00Z', available: false },
      ],
    },
  },

  Booking: {
    Link: {
      response: {
        id: 'link-123',
        slug: 'meet-john',
        title: '30 min meeting',
        description: 'Casual chat',
        duration: 30,
        is_active: true,
        availability_id: 'avail-123',
      },
    },
    Booking: {
      response: {
        id: 'booking-123',
        link_id: 'link-123',
        guest_email: 'guest@example.com',
        start_time: '2024-01-22T10:00:00Z',
        end_time: '2024-01-22T10:30:00Z',
        status: 'confirmed',
      },
    },
  },

  Calendar: {
    Calendar: {
      response: {
        id: 'cal-123',
        name: 'Personal Calendar',
        color: '#4285F4',
        is_primary: true,
        integration_provider: 'google',
      },
    },
    List: {
      response: {
        items: [
          {
            id: 'cal-123',
            name: 'Personal Calendar',
            color: '#4285F4',
            is_primary: true,
          }
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 20
        }
      },
    },
  },

  Task: {
    Task: {
      response: {
        id: 'task-123',
        title: 'Complete Project Report',
        description: 'Finish the Q1 report',
        due_date: '2024-01-30T17:00:00Z',
        status: 'pending',
        priority: 'high',
      },
    },
    List: {
      response: {
        items: [
          {
            id: 'task-123',
            title: 'Complete Project Report',
            description: 'Finish the Q1 report',
            due_date: '2024-01-30T17:00:00Z',
            status: 'pending',
            priority: 'high',
          }
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 20
        }
      },
    },
  },

  Team: {
    Team: {
      response: {
        id: 'team-123',
        name: 'Engineering Team',
        description: 'Core engineering team',
        owner_id: 'user-123',
        members_count: 5,
      },
    },
    List: {
      response: [
        {
          id: 'team-123',
          name: 'Engineering Team',
          description: 'Core engineering team',
          owner_id: 'user-123',
          members_count: 5,
        }
      ],
    },
  },

  Analytics: {
    Overview: {
      response: {
        total_events: 42,
        total_duration_minutes: 2520,
        busiest_day: 'Wednesday',
        avg_meetings_per_day: 6,
        top_collaborators: [
          { name: 'Alice', count: 12 },
          { name: 'Bob', count: 8 },
        ],
      },
    },
    Detailed: {
      response: {
        meetings_by_day: {
          Monday: 5,
          Tuesday: 7,
          Wednesday: 8,
          Thursday: 6,
          Friday: 4,
        },
        meeting_types: {
          '1-on-1': 10,
          'Team Sync': 5,
          'External': 3,
        },
      },
    },
    Events: {
      response: {
        total_events: 42,
        events_trend: [
          { date: '2024-01-01', count: 5 },
          { date: '2024-01-02', count: 7 },
        ],
      },
    },
    TimeUtilization: {
      response: {
        total_available_hours: 40,
        meeting_hours: 15,
        focus_hours: 20,
        utilization_rate: 37.5,
      },
    },
    Categories: {
      response: [
        { category: 'Deep Work', minutes: 1200, percentage: 47.6 },
        { category: 'Meetings', minutes: 800, percentage: 31.7 },
        { category: 'Admin', minutes: 520, percentage: 20.6 },
      ],
    },
    TimeDistribution: {
      response: [
        { period: 'Morning', minutes: 600, percentage: 23.8 },
        { period: 'Afternoon', minutes: 1920, percentage: 76.2 },
      ],
    },
    Attendees: {
      response: {
        total_attendees: 150,
        unique_attendees: 45,
        top_attendees: [
          { email: 'colleague@example.com', name: 'Colleague', meetings: 10 },
        ],
      },
    },
    Bookings: {
      response: {
        total_bookings: 25,
        completed: 20,
        cancelled: 3,
        rescheduled: 2,
        booking_trend: [
          { date: '2024-01-01', count: 2 },
          { date: '2024-01-02', count: 3 },
        ],
      },
    },
  },

  Blog: {
    Post: {
      request: {
        title: 'The Future of Productivity',
        content: 'Productivity is evolving...',
        excerpt: 'A deep dive into AI tools.',
        slug: 'future-of-productivity',
        status: 'published',
        tags: ['productivity', 'ai'],
        categories: ['Technology'],
        featured_image: 'https://example.com/image.jpg',
      },
      response: {
        id: 'post-123',
        title: 'The Future of Productivity',
        content: 'Productivity is evolving...',
        excerpt: 'A deep dive into AI tools.',
        slug: 'future-of-productivity',
        status: 'published',
        author_id: 'user-123',
        published_at: '2024-01-15T12:00:00Z',
        created_at: '2024-01-15T10:00:00Z',
        tags: ['productivity', 'ai'],
        categories: ['Technology'],
        views: 150,
        likes: 20,
      },
    },
    List: {
      response: {
        data: [
          {
            id: 'post-123',
            title: 'The Future of Productivity',
            slug: 'future-of-productivity',
            status: 'published',
            author_id: 'user-123',
            published_at: '2024-01-15T12:00:00Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  },

  Contact: {
    Create: {
      request: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'I have a question about pricing.',
      },
      response: {
        id: 'contact-123',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'I have a question about pricing.',
        status: 'new',
        created_at: '2024-01-15T10:00:00Z',
      },
    },
    List: {
      response: [
        {
          id: 'contact-123',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Inquiry',
          status: 'new',
        },
      ],
    },
  },

  Notification: {
    ScheduleReminders: {
      response: {
        success: true,
        message: 'Scheduled 5 reminders',
        data: { count: 5 },
      },
    },
    Pending: {
      response: [
        {
          id: 'notif-123',
          type: 'email',
          event_id: 'evt-123',
          user_id: 'user-123',
          scheduled_at: '2024-01-22T08:55:00Z',
          status: 'pending',
        },
      ],
    },
  },

  Priority: {
    List: {
      response: [
        {
          id: 'prio-123',
          user_id: 'user-123',
          item_id: 'task-123',
          item_type: 'task',
          priority: 'high',
          score: 85,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ],
    },
    Item: {
      response: {
        id: 'prio-123',
        user_id: 'user-123',
        item_id: 'task-123',
        item_type: 'task',
        priority: 'high',
        score: 85,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      },
    },
  },

  Cloudinary: {
    Upload: {
      response: {
        public_id: 'avatar_user123',
        url: 'http://res.cloudinary.com/demo/image/upload/v123456789/avatar_user123.jpg',
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v123456789/avatar_user123.jpg',
        width: 200,
        height: 200,
        format: 'jpg',
        bytes: 1024,
      },
    },
    Delete: {
      response: {
        success: true,
        message: 'Image deleted successfully',
      },
    },
  },

  Email: {
    Send: {
      response: {
        success: true,
        message: 'Email sent successfully',
        data: {
          messageId: '<message-id@smtp.example.com>',
          logId: 'log-123',
        },
      },
    },
    Logs: {
      response: [
        {
          id: 'log-123',
          user_id: 'user-123',
          to: 'recipient@example.com',
          subject: 'Welcome',
          status: 'sent',
          created_at: '2024-01-15T10:00:00Z',
        },
      ],
    },
  },

  Google: {
    AuthUrl: {
      response: {
        auth_url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...',
      },
    },
    Calendars: {
      response: {
        calendars: [
          { id: 'primary', summary: 'Primary Calendar' },
        ],
        count: 1,
      },
    },
    Status: {
      response: {
        connected: true,
        scope: 'https://www.googleapis.com/auth/calendar',
        expires_at: '2024-01-15T11:00:00Z',
      },
    },
    Meet: {
      response: {
        id: 'meet-123',
        url: 'https://meet.google.com/abc-defg-hij',
      },
    },
  },

  Health: {
    System: {
      response: {
        status: 'ok',
        timestamp: '2024-01-15T10:00:00Z',
        uptime: 3600,
        database: { connected: true },
        memory: { used: '50MB' },
        version: '1.0.0',
      },
    },
    Database: {
      response: {
        status: 'healthy',
        timestamp: '2024-01-15T10:00:00Z',
        stats: { connections: 10 },
      },
    },
  },

  Webhook: {
    Stats: {
      response: {
        totalActive: 10,
        expiringWithin24h: 2,
        expired: 0,
      },
    },
    Renew: {
      response: {
        renewed: true,
      },
    },
    Errors: {
      response: {
        totalErrors: 5,
        unresolvedErrors: 1,
        recentErrors: 0,
      },
    },
    Health: {
      response: {
        webhooks: { status: 'good' },
        syncErrors: { status: 'good' },
        overallHealth: 'good',
      },
    },
  },

  CalendarSync: {
    Initial: {
      response: {
        totalGoogleEvents: 15,
        totalCalentoEvents: 10,
        imported: 12,
        conflicts: [],
        errors: [],
      },
    },
    Status: {
      response: {
        isConnected: true,
        isSyncEnabled: true,
        lastSyncAt: '2024-01-15T10:30:00Z',
      },
    },
    Conflicts: {
      response: [
        {
          calendoEventId: 'abc-123',
          googleEventId: 'google-xyz',
          reason: 'duplicate',
          resolution: 'merge_prefer_calento',
          resolved: false,
        },
      ],
    },
  },

  EventQueue: {
    Job: {
      response: {
        success: true,
        message: 'Job queued successfully',
        data: {
          jobId: 'job-123',
          queueName: 'event-sync',
          priority: 'medium',
        },
      },
    },
    Status: {
      response: {
        success: true,
        data: {
          id: 'job-123',
          state: 'completed',
          progress: 100,
          result: { success: true },
        },
      },
    },
  },

  Invitation: {
    Response: {
      response: {
        id: 'inv-123',
        event_id: 'evt-123',
        email: 'guest@example.com',
        status: 'accepted',
        token: 'token-123',
      },
    },
  },

  QueueManagement: {
    Health: {
      response: {
        success: true,
        data: {
          queues: [
            {
              name: 'event-sync',
              health: 'healthy',
              metrics: {
                active: 5,
                waiting: 10,
                completed: 100,
                failed: 2,
              },
            },
          ],
          overall: 'healthy',
          timestamp: '2024-01-15T10:00:00Z',
        },
      },
    },
    Metrics: {
      response: {
        success: true,
        data: {
          name: 'event-sync',
          health: 'healthy',
          metrics: {
            waiting: 10,
            active: 5,
            completed: 100,
            failed: 2,
            delayed: 0,
            paused: 0,
          },
        },
      },
    },
    Jobs: {
      Failed: {
        response: {
          success: true,
          data: {
            jobs: [
              {
                id: '1',
                name: 'sync-event',
                failedReason: 'Timeout',
                timestamp: 1234567890,
              },
            ],
            total: 1,
          },
        },
      },
      Details: {
        response: {
          success: true,
          data: {
            id: '1',
            name: 'sync-event',
            state: 'failed',
            data: {},
            failedReason: 'Timeout',
          },
        },
      },
    },
    Action: {
      response: {
        success: true,
        message: 'Action completed successfully',
      },
    },
  },

  Debug: {
    Cors: {
      response: {
        corsOrigins: '*',
        corsCredentials: true,
        corsMethods: 'GET,POST',
        corsExposedHeaders: 'Content-Range',
        corsMaxAge: 3600,
        nodeEnv: 'development',
        apiUrl: 'http://localhost:3000',
      },
    },
  },
};
