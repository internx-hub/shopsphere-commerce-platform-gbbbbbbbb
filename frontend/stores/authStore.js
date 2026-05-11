import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => {
    set({ user, loading: false });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  clearUser: () => {
    set({ user: null, loading: false });
  },
}));

export { useAuthStore };