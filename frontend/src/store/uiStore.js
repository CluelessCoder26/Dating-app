import { create } from 'zustand';










export const useUIStore = create((set) => ({
  theme: 'dark', // Modern default
  sidebarOpen: false,
  isLoading: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setLoading: (isLoading) => set({ isLoading })
}));