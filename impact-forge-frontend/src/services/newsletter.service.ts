/**
 * Newsletter Service
 * Handles all newsletter subscription-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface NewsletterSubscription {
  id: number;
  email: string;
  status: string;
  subscribed_at?: string;
  updated_at?: string;
}

export const newsletterService = {
  /**
   * Get all newsletter subscriptions (admin only)
   */
  getNewsletterSubscriptions: async (status?: string) => {
    const url = status ? `${API_ENDPOINTS.NEWSLETTER.LIST}?status=${status}` : API_ENDPOINTS.NEWSLETTER.LIST;
    return api.get<NewsletterSubscription[]>(url);
  },

  /**
   * Get newsletter subscription by ID (admin only)
   */
  getNewsletterSubscriptionById: async (id: number | string) => {
    return api.get<NewsletterSubscription>(API_ENDPOINTS.NEWSLETTER.GET_BY_ID(id), false);
  },

  /**
   * Subscribe to newsletter (public)
   */
  subscribeToNewsletter: async (email: string) => {
    return api.post<NewsletterSubscription>(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, { email }, false);
  },

  /**
   * Unsubscribe from newsletter (public)
   */
  unsubscribeFromNewsletter: async (email: string) => {
    return api.post(API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE, { email }, false);
  },

  /**
   * Update newsletter subscription (admin only)
   */
  updateNewsletterSubscription: async (id: number | string, data: Partial<NewsletterSubscription>) => {
    return api.put<NewsletterSubscription>(API_ENDPOINTS.NEWSLETTER.UPDATE(id), data);
  },

  /**
   * Delete newsletter subscription (admin only)
   */
  deleteNewsletterSubscription: async (id: number | string) => {
    return api.delete(API_ENDPOINTS.NEWSLETTER.DELETE(id));
  },
};


