/**
 * Volunteer Service
 * Handles all volunteer-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface Volunteer {
  id: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  country: string;
  skills?: string[];
  interests?: string[];
  availability: string;
  experience?: string;
  motivation: string;
  status: string;
  hours_completed?: number;
  projects_joined?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterVolunteerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  availability: "weekdays" | "weekends" | "flexible" | "remote";
  motivation: string;
  skills?: string[];
  interests?: string[];
  address?: string;
  experience?: string;
}

export const volunteerService = {
  /**
   * Register as volunteer
   */
  register: async (data: RegisterVolunteerData) => {
    return api.post<Volunteer>(API_ENDPOINTS.VOLUNTEERS.REGISTER, data, false);
  },

  /**
   * Get all volunteers (admin only)
   */
  getVolunteers: async () => {
    return api.get<Volunteer[]>(API_ENDPOINTS.VOLUNTEERS.LIST);
  },

  /**
   * Get volunteer by ID
   */
  getVolunteerById: async (id: number | string) => {
    return api.get<Volunteer>(API_ENDPOINTS.VOLUNTEERS.GET_BY_ID(id), false);
  },

  /**
   * Get my volunteer profile
   */
  getMyProfile: async () => {
    return api.get<Volunteer>(API_ENDPOINTS.VOLUNTEERS.MY_PROFILE);
  },

  /**
   * Update volunteer status (admin only)
   */
  updateStatus: async (id: number | string, status: string) => {
    return api.put(API_ENDPOINTS.VOLUNTEERS.UPDATE_STATUS(id), { status });
  },

  /**
   * Generate certificate
   */
  generateCertificate: async (id: number | string) => {
    return api.get(API_ENDPOINTS.VOLUNTEERS.CERTIFICATE(id));
  },
};

