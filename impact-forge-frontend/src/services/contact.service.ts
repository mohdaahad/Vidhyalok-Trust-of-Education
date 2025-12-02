/**
 * Contact Service
 * Handles all contact submission-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface ContactSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactSubmissionData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  /**
   * Get all contact submissions (admin only)
   */
  getContactSubmissions: async (status?: string) => {
    const url = status ? `${API_ENDPOINTS.CONTACT.LIST}?status=${status}` : API_ENDPOINTS.CONTACT.LIST;
    return api.get<ContactSubmission[]>(url);
  },

  /**
   * Get contact submission by ID (admin only)
   */
  getContactSubmissionById: async (id: number | string) => {
    return api.get<ContactSubmission>(API_ENDPOINTS.CONTACT.GET_BY_ID(id), false);
  },

  /**
   * Create contact submission (public)
   */
  createContactSubmission: async (data: CreateContactSubmissionData) => {
    return api.post<ContactSubmission>(API_ENDPOINTS.CONTACT.CREATE, data, false);
  },

  /**
   * Update contact submission (admin only)
   */
  updateContactSubmission: async (id: number | string, data: Partial<ContactSubmission>) => {
    return api.put<ContactSubmission>(API_ENDPOINTS.CONTACT.UPDATE(id), data);
  },

  /**
   * Delete contact submission (admin only)
   */
  deleteContactSubmission: async (id: number | string) => {
    return api.delete(API_ENDPOINTS.CONTACT.DELETE(id));
  },
};


