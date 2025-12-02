/**
 * Donation Service
 * Handles all donation-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface Donation {
  id: number;
  transaction_id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  project_id?: number;
  payment_method: string;
  donation_type: string;
  status: string;
  is_anonymous: boolean;
  message?: string;
  pan_number?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  created_at?: string;
  updated_at?: string;
  project?: {
    id: number;
    title: string;
  };
}

export interface CreateDonationData {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  donation_type: "one-time" | "monthly";
  payment_method?: string;
  project_id?: number;
  message?: string;
  pan_number?: string;
  is_anonymous?: boolean;
}

export const donationService = {
  /**
   * Get all donations (public stats - only completed)
   */
  getDonations: async () => {
    return api.get<Donation[]>(API_ENDPOINTS.DONATIONS.LIST, false);
  },

  /**
   * Get all donations (admin - all statuses)
   */
  getAdminDonations: async (status?: string, project_id?: number) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (project_id) params.append("project_id", project_id.toString());
    const url = `${API_ENDPOINTS.DONATIONS.LIST}/admin${params.toString() ? `?${params.toString()}` : ""}`;
    return api.get<Donation[]>(url);
  },

  /**
   * Create a donation
   */
  createDonation: async (data: CreateDonationData) => {
    return api.post<Donation>(API_ENDPOINTS.DONATIONS.CREATE, data, false);
  },

  /**
   * Get donation by ID
   */
  getDonationById: async (id: number | string) => {
    return api.get<Donation>(API_ENDPOINTS.DONATIONS.GET_BY_ID(id), false);
  },

  /**
   * Get my donations
   */
  getMyDonations: async () => {
    return api.get<Donation[]>(API_ENDPOINTS.DONATIONS.MY_DONATIONS);
  },

  /**
   * Verify payment
   */
  verifyPayment: async (data: any) => {
    return api.post(API_ENDPOINTS.DONATIONS.VERIFY_PAYMENT, data, false);
  },

  /**
   * Generate receipt (returns blob for PDF download)
   */
  generateReceipt: async (id: number | string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DONATIONS.RECEIPT(id)}`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate receipt");
    }

    // Check if response is PDF (blob) or JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/pdf")) {
      return await response.blob();
    } else {
      return await response.json();
    }
  },

  /**
   * Generate tax certificate (returns blob for PDF download)
   */
  generateTaxCertificate: async (id: number | string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DONATIONS.TAX_CERTIFICATE(id)}`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate tax certificate");
    }

    // Check if response is PDF (blob) or JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/pdf")) {
      return await response.blob();
    } else {
      return await response.json();
    }
  },

  /**
   * Update donation (admin only)
   */
  updateDonation: async (id: number | string, data: Partial<Donation>) => {
    return api.put<Donation>(API_ENDPOINTS.DONATIONS.UPDATE(id), data);
  },
};

