import { useState, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export const useAuth = () => {
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();
  const setLoading = useUIStore((state) => state.setLoading);
  const [error, setError] = useState(null);

  const login = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.token);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to register';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      storeLogout();
      setLoading(false);
    }
  }, [storeLogout, setLoading]);

  return {
    user,
    isAuthenticated,
    error,
    login,
    register,
    logout
  };
};