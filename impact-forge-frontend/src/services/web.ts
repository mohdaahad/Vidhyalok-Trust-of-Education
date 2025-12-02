/**
 * API Endpoints Configuration
 * All API URLs are defined here based on backend routes
 */

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ME: "/auth/me",
        UPDATE_PROFILE: "/auth/profile",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    },

    // Admin endpoints
    ADMIN: {
        LOGIN: "/admin/login",
        DASHBOARD: "/admin/dashboard",
        DONORS: "/admin/donors",
        TRANSACTIONS: "/admin/transactions",
        EXPORT_REPORTS: "/admin/reports/export",
    },

    // Donation endpoints
    DONATIONS: {
        LIST: "/donations",
        CREATE: "/donations",
        GET_BY_ID: (id: number | string) => `/donations/${id}`,
        UPDATE: (id: number | string) => `/donations/${id}`,
        MY_DONATIONS: "/donations/my-donations",
        VERIFY_PAYMENT: "/donations/verify-payment",
        RECEIPT: (id: number | string) => `/donations/${id}/receipt`,
        TAX_CERTIFICATE: (id: number | string) => `/donations/${id}/tax-certificate`,
    },

    // Volunteer endpoints
    VOLUNTEERS: {
        REGISTER: "/volunteers/register",
        LIST: "/volunteers",
        GET_BY_ID: (id: number | string) => `/volunteers/${id}`,
        MY_PROFILE: "/volunteers/my-profile",
        UPDATE_STATUS: (id: number | string) => `/volunteers/${id}/status`,
        CERTIFICATE: (id: number | string) => `/volunteers/${id}/certificate`,
    },

    // Project endpoints
    PROJECTS: {
        LIST: "/projects",
        CREATE: "/projects",
        GET_BY_ID: (id: number | string) => `/projects/${id}`,
        UPDATE: (id: number | string) => `/projects/${id}`,
        DELETE: (id: number | string) => `/projects/${id}`,
        ADD_UPDATE: (id: number | string) => `/projects/${id}/updates`,
        GET_UPDATES: (id: number | string) => `/projects/${id}/updates`,
        ADD_GALLERY: (id: number | string) => `/projects/${id}/gallery`,
        GET_GALLERY: (id: number | string) => `/projects/${id}/gallery`,
        DELETE_GALLERY: (id: number | string, galleryId: number | string) => `/projects/${id}/gallery/${galleryId}`,
    },

    // Event endpoints
    EVENTS: {
        LIST: "/events",
        CREATE: "/events",
        GET_BY_ID: (id: number | string) => `/events/${id}`,
        UPDATE: (id: number | string) => `/events/${id}`,
        DELETE: (id: number | string) => `/events/${id}`,
        REGISTER: (id: number | string) => `/events/${id}/register`,
        MY_EVENTS: "/events/my-events",
        ADD_AGENDA: (id: number | string) => `/events/${id}/agenda`,
        GET_AGENDA: (id: number | string) => `/events/${id}/agenda`,
        DELETE_AGENDA: (id: number | string, agendaId: number | string) => `/events/${id}/agenda/${agendaId}`,
        ADD_GALLERY: (id: number | string) => `/events/${id}/gallery`,
        GET_GALLERY: (id: number | string) => `/events/${id}/gallery`,
        DELETE_GALLERY: (id: number | string, galleryId: number | string) => `/events/${id}/gallery/${galleryId}`,
        ADD_IMPACT_METRIC: (id: number | string) => `/events/${id}/impact-metrics`,
        GET_IMPACT_METRICS: (id: number | string) => `/events/${id}/impact-metrics`,
        DELETE_IMPACT_METRIC: (id: number | string, metricId: number | string) => `/events/${id}/impact-metrics/${metricId}`,
        ADD_TESTIMONIAL: (id: number | string) => `/events/${id}/testimonials`,
        GET_TESTIMONIALS: (id: number | string) => `/events/${id}/testimonials`,
        DELETE_TESTIMONIAL: (id: number | string, testimonialId: number | string) => `/events/${id}/testimonials/${testimonialId}`,
        UPDATE_REGISTRATION_STATUS: (id: number | string, registrationId: number | string) => `/events/${id}/registrations/${registrationId}`,
    },

    // Media endpoints
    MEDIA: {
        LIST: "/media",
        UPLOAD_IMAGE: "/media/upload/image",
        UPLOAD_VIDEO: "/media/upload/video",
        DELETE: (id: number | string) => `/media/${id}`,
    },

    // Contact endpoints
    CONTACT: {
        LIST: "/contacts",
        GET_BY_ID: (id: number | string) => `/contacts/${id}`,
        CREATE: "/contacts",
        UPDATE: (id: number | string) => `/contacts/${id}`,
        DELETE: (id: number | string) => `/contacts/${id}`,
    },

    // Newsletter endpoints
    NEWSLETTER: {
        LIST: "/newsletters",
        GET_BY_ID: (id: number | string) => `/newsletters/${id}`,
        SUBSCRIBE: "/newsletters/subscribe",
        UNSUBSCRIBE: "/newsletters/unsubscribe",
        UPDATE: (id: number | string) => `/newsletters/${id}`,
        DELETE: (id: number | string) => `/newsletters/${id}`,
    },
} as const;

