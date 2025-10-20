'use client';

import { useAuthStore } from '../../store/auth.store';

export const useAuth = () => {
  return useAuthStore();
};
