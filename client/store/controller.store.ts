import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ControllerState {
  expandedSidebar: boolean;
  expandedMobileSidebar: boolean;
  expandedCalendarSidebar: boolean;
}

interface ControllerActions {
  setExpandedSidebar: (expanded: boolean) => void;
  setExpandedMobileSidebar: (expanded: boolean) => void;
  setExpandedCalendarSidebar: (expanded: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  toggleCalendarSidebar: () => void;
  reset: () => void;
}

interface ControllerStore extends ControllerState, ControllerActions {}

const initialState: ControllerState = {
  expandedSidebar: true,
  expandedMobileSidebar: false,
  expandedCalendarSidebar: true,
};

export const useControllerStore = create<ControllerStore>()(
  persist(
    (set) => ({
      ...initialState,

      setExpandedSidebar: (expanded) =>
        set({ expandedSidebar: expanded }),

      setExpandedMobileSidebar: (expanded) =>
        set({ expandedMobileSidebar: expanded }),

      setExpandedCalendarSidebar: (expanded) =>
        set({ expandedCalendarSidebar: expanded }),

      toggleSidebar: () =>
        set((state) => ({ expandedSidebar: !state.expandedSidebar })),

      toggleMobileSidebar: () =>
        set((state) => ({ expandedMobileSidebar: !state.expandedMobileSidebar })),

      toggleCalendarSidebar: () =>
        set((state) => ({ expandedCalendarSidebar: !state.expandedCalendarSidebar })),

      reset: () => set(initialState),
    }),
    {
      name: 'tempra-controller-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        expandedSidebar: state.expandedSidebar,
        expandedMobileSidebar: state.expandedMobileSidebar,
        expandedCalendarSidebar: state.expandedCalendarSidebar,
      }),
    }
  )
);