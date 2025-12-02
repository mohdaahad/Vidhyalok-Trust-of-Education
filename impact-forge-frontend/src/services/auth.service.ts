/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
      false
    );
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      false
    );
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  },

  /**
   * Admin login
   */
  adminLogin: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.ADMIN.LOGIN,
      credentials,
      false
    );
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("userRole", response.user?.role || "");
    }
    return response;
  },

  /**
   * Get current user
   */
  getMe: async () => {
    return api.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<RegisterData>) => {
    return api.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, false);
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, password: string) => {
    return api.put(
      API_ENDPOINTS.AUTH.RESET_PASSWORD(token),
      { password },
      false
    );
  },

  /**
   * Logout (clear token from localStorage)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    return localStorage.getItem("userRole") === "admin";
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Get user role
   */
  getUserRole: (): string | null => {
    return localStorage.getItem("userRole");
  },
};

