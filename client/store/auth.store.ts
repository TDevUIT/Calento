import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User, LoginRequest, RegisterRequest } from '../interface/auth.interface';
import { login, register, logout, refreshToken, getCurrentUser, checkAuthStatus } from '../service/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  reset: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const migrateUserData = (user: any): User | null => {
  if (!user) return null;
  
  if (user.data && typeof user.data === 'object') {
    return user.data as User;
  }
  
  return user as User;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setUser: (user) =>
        set((state) => {
          state.user = migrateUserData(user);
          state.isAuthenticated = !!user;
          state.error = null;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      login: async (credentials) => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          const authResponse = await login(credentials);
          
          set((state) => {
            state.user = migrateUserData(authResponse.user);
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          
          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
          
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          const authResponse = await register(userData);
          
          set((state) => {
            state.user = migrateUserData(authResponse.user);
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          
          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
          
          throw error;
        }
      },

      logout: async () => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          await logout();
          
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
          });
        } catch (error) {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        }
      },

      refreshToken: async () => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          await refreshToken();
      
          set((state) => {
            state.isLoading = false;
            state.isAuthenticated = true;
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
          
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = errorMessage;
            state.isLoading = false;
          });
          
          throw error;
        }
      },

      checkAuthStatus: async () => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const user = await getCurrentUser();
          
          set((state) => {
            state.user = migrateUserData(user);
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        }
      },

      reset: () => set(() => initialState),
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            user: migrateUserData(persistedState.user),
          };
        }
        return persistedState;
      },
    }
  )
);
