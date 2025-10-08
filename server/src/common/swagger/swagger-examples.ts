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
};
