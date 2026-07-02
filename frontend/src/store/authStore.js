import { create } from 'zustand';
import { persist } from 'zustand/middleware';



















export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      updateUser: (updatedUser) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null
      })),
      logout: () => set({ user: null, token: null, isAuthenticated: false })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }) // Persist only the token
    }
  )
);