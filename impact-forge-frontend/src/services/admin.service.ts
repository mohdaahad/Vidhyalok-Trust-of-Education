/**
 * Admin Service
 * Handles all admin-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface DashboardStats {
    totalDonations: number;
    totalDonationsCount: number;
    totalVolunteers: number;
    activeVolunteers: number;
    activeProjects: number;
    totalProjects: number;
    upcomingEvents: number;
    totalEvents: number;
    newContacts: number;
    totalNewsletters: number;
    monthlyDonations: Array<{ month: string; amount: number }>;
    projectDistribution: Array<{ name: string; value: number }>;
}

export interface Donor {
    id: number;
    email: string;
    name: string;
    totalDonated: number;
    donationCount: number;
}

export interface Transaction {
    id: number;
    amount: number;
    status: string;
    createdAt: string;
    donor: {
        name: string;
        email: string;
    };
}

export const adminService = {
    /**
     * Get dashboard statistics
     */
    getDashboardStats: async () => {
        return api.get<DashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD);
    },

    /**
     * Get all donors
     */
    getDonors: async () => {
        return api.get<Donor[]>(API_ENDPOINTS.ADMIN.DONORS);
    },

    /**
     * Get all transactions
     */
    getTransactions: async () => {
        return api.get<Transaction[]>(API_ENDPOINTS.ADMIN.TRANSACTIONS);
    },

    /**
     * Export reports
     */
    exportReports: async () => {
        return api.get(API_ENDPOINTS.ADMIN.EXPORT_REPORTS);
    },
};

