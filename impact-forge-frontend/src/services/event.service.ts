/**
 * Event Service
 * Handles all event-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface Event {
  id: number;
  title: string;
  description: string;
  full_description?: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  image_url?: string;
  category: string;
  type?: string;
  max_participants?: number;
  registered_count: number;
  capacity?: string;
  attendees: number;
  status: string;
  impact?: string;
  is_past: boolean;
  created_at?: string;
  updated_at?: string;
  gallery?: EventGallery[];
  agenda?: EventAgenda[];
  impactMetrics?: EventImpactMetric[];
  testimonials?: EventTestimonial[];
  registrations?: EventRegistration[];
}

export interface EventAgenda {
  id: number;
  event_id: number;
  time: string;
  activity: string;
  display_order: number;
  created_at?: string;
}

export interface EventGallery {
  id: number;
  event_id: number;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at?: string;
}

export interface EventImpactMetric {
  id: number;
  event_id: number;
  label: string;
  value: string;
  icon_type?: string;
  display_order: number;
  created_at?: string;
}

export interface EventTestimonial {
  id: number;
  event_id: number;
  name: string;
  role?: string;
  quote: string;
  display_order: number;
  created_at?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  number_of_guests: number;
  special_requirements?: string;
  status: string;
  created_at?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  full_description?: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  image_url?: string;
  image?: File;
  category: string;
  type?: string;
  max_participants?: number;
  capacity?: string;
  status?: string;
  impact?: string;
}

export const eventService = {
  /**
   * Get all events
   */
  getEvents: async (status?: string) => {
    const url = status ? `${API_ENDPOINTS.EVENTS.LIST}?status=${status}` : API_ENDPOINTS.EVENTS.LIST;
    return api.get<Event[]>(url, false);
  },

  /**
   * Get event by ID
   */
  getEventById: async (id: number | string) => {
    return api.get<Event>(API_ENDPOINTS.EVENTS.GET_BY_ID(id), false);
  },

  /**
   * Create event (admin only)
   * Supports both file upload and URL
   */
  createEvent: async (data: CreateEventData) => {
    // If image file is provided, use FormData
    if (data.image) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.full_description) formData.append("full_description", data.full_description);
      formData.append("date", data.date);
      if (data.time) formData.append("time", data.time);
      formData.append("location", data.location);
      if (data.address) formData.append("address", data.address);
      formData.append("image", data.image);
      formData.append("category", data.category);
      if (data.type) formData.append("type", data.type);
      if (data.max_participants) formData.append("max_participants", data.max_participants.toString());
      if (data.capacity) formData.append("capacity", data.capacity);
      if (data.status) formData.append("status", data.status);
      if (data.impact) formData.append("impact", data.impact);

      return api.post<Event>(API_ENDPOINTS.EVENTS.CREATE, formData, true, true);
    }

    // Otherwise use JSON
    return api.post<Event>(API_ENDPOINTS.EVENTS.CREATE, data);
  },

  /**
   * Update event (admin only)
   * Supports both file upload and URL
   */
  updateEvent: async (id: number | string, data: Partial<CreateEventData>) => {
    // If image file is provided, use FormData
    if (data.image) {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.full_description) formData.append("full_description", data.full_description);
      if (data.date) formData.append("date", data.date);
      if (data.time) formData.append("time", data.time);
      if (data.location) formData.append("location", data.location);
      if (data.address) formData.append("address", data.address);
      formData.append("image", data.image);
      if (data.category) formData.append("category", data.category);
      if (data.type) formData.append("type", data.type);
      if (data.max_participants !== undefined) formData.append("max_participants", data.max_participants.toString());
      if (data.capacity) formData.append("capacity", data.capacity);
      if (data.status) formData.append("status", data.status);
      if (data.impact) formData.append("impact", data.impact);

      return api.put<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), formData, true, true);
    }

    // Otherwise use JSON
    return api.put<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), data);
  },

  /**
   * Delete event (admin only)
   */
  deleteEvent: async (id: number | string) => {
    return api.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  },

  /**
   * Register for event
   */
  registerForEvent: async (id: number | string, data: {
    participant_name: string;
    participant_email: string;
    participant_phone: string;
    number_of_guests?: number;
    special_requirements?: string;
  }) => {
    return api.post<EventRegistration>(API_ENDPOINTS.EVENTS.REGISTER(id), data);
  },

  /**
   * Get my events
   */
  getMyEvents: async () => {
    return api.get<Event[]>(API_ENDPOINTS.EVENTS.MY_EVENTS);
  },

  /**
   * Add event agenda item (admin only)
   */
  addAgenda: async (id: number | string, data: { time: string; activity: string; display_order?: number }) => {
    return api.post<EventAgenda>(API_ENDPOINTS.EVENTS.ADD_AGENDA(id), data);
  },

  /**
   * Get event agenda
   */
  getAgenda: async (id: number | string) => {
    return api.get<EventAgenda[]>(API_ENDPOINTS.EVENTS.GET_AGENDA(id), false);
  },

  /**
   * Delete event agenda item (admin only)
   */
  deleteAgenda: async (id: number | string, agendaId: number | string) => {
    return api.delete(API_ENDPOINTS.EVENTS.DELETE_AGENDA(id, agendaId));
  },

  /**
   * Add event gallery image (admin only)
   * Supports both file upload and URL
   */
  addGalleryImage: async (
    id: number | string,
    data: { image_url?: string; image?: File; caption?: string; display_order?: number }
  ) => {
    // If image file is provided, use FormData
    if (data.image) {
      const formData = new FormData();
      formData.append("image", data.image);
      if (data.caption) formData.append("caption", data.caption);
      if (data.display_order !== undefined) formData.append("display_order", data.display_order.toString());

      return api.post<EventGallery>(API_ENDPOINTS.EVENTS.ADD_GALLERY(id), formData, true, true);
    }

    // Otherwise use JSON with image_url
    return api.post<EventGallery>(API_ENDPOINTS.EVENTS.ADD_GALLERY(id), data);
  },

  /**
   * Get event gallery
   */
  getGallery: async (id: number | string) => {
    return api.get<EventGallery[]>(API_ENDPOINTS.EVENTS.GET_GALLERY(id), false);
  },

  /**
   * Delete event gallery image (admin only)
   */
  deleteGalleryImage: async (id: number | string, galleryId: number | string) => {
    return api.delete(API_ENDPOINTS.EVENTS.DELETE_GALLERY(id, galleryId));
  },

  /**
   * Add event impact metric (admin only)
   */
  addImpactMetric: async (
    id: number | string,
    data: { label: string; value: string; icon_type?: string; display_order?: number }
  ) => {
    return api.post<EventImpactMetric>(API_ENDPOINTS.EVENTS.ADD_IMPACT_METRIC(id), data);
  },

  /**
   * Get event impact metrics
   */
  getImpactMetrics: async (id: number | string) => {
    return api.get<EventImpactMetric[]>(API_ENDPOINTS.EVENTS.GET_IMPACT_METRICS(id), false);
  },

  /**
   * Delete event impact metric (admin only)
   */
  deleteImpactMetric: async (id: number | string, metricId: number | string) => {
    return api.delete(API_ENDPOINTS.EVENTS.DELETE_IMPACT_METRIC(id, metricId));
  },

  /**
   * Add event testimonial (admin only)
   */
  addTestimonial: async (
    id: number | string,
    data: { name: string; role?: string; quote: string; display_order?: number }
  ) => {
    return api.post<EventTestimonial>(API_ENDPOINTS.EVENTS.ADD_TESTIMONIAL(id), data);
  },

  /**
   * Get event testimonials
   */
  getTestimonials: async (id: number | string) => {
    return api.get<EventTestimonial[]>(API_ENDPOINTS.EVENTS.GET_TESTIMONIALS(id), false);
  },

  /**
   * Delete event testimonial (admin only)
   */
  deleteTestimonial: async (id: number | string, testimonialId: number | string) => {
    return api.delete(API_ENDPOINTS.EVENTS.DELETE_TESTIMONIAL(id, testimonialId));
  },

  /**
   * Update event registration status (admin only)
   */
  updateRegistrationStatus: async (
    id: number | string,
    registrationId: number | string,
    status: "pending" | "confirmed" | "cancelled" | "attended"
  ) => {
    return api.put<EventRegistration>(API_ENDPOINTS.EVENTS.UPDATE_REGISTRATION_STATUS(id, registrationId), { status });
  },
};
