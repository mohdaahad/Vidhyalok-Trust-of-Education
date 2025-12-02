/**
 * Project Service
 * Handles all project-related API calls
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface Project {
  id: number;
  title: string;
  description: string;
  full_description?: string;
  category: string;
  location: string;
  target_amount: number;
  raised_amount: number;
  status: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  beneficiaries?: string;
  created_at?: string;
  updated_at?: string;
  updates?: ProjectUpdate[];
  gallery?: ProjectGallery[];
}

export interface ProjectUpdate {
  id: number;
  project_id: number;
  title: string;
  content: string;
  update_date: string;
  created_at?: string;
}

export interface ProjectGallery {
  id: number;
  project_id: number;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at?: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  full_description?: string;
  category: string;
  location: string;
  target_amount: number;
  image_url?: string;
  image?: File; // File object for direct upload
  status?: string;
  start_date?: string;
  end_date?: string;
  beneficiaries?: string;
}

export const projectService = {
  /**
   * Get all projects
   */
  getProjects: async () => {
    return api.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST, false);
  },

  /**
   * Get project by ID
   */
  getProjectById: async (id: number | string) => {
    return api.get<Project>(API_ENDPOINTS.PROJECTS.GET_BY_ID(id), false);
  },

  /**
   * Create project (admin only)
   * Supports both file upload and URL
   */
  createProject: async (data: CreateProjectData) => {
    // If image file is provided, use FormData
    if (data.image) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.full_description) formData.append("full_description", data.full_description);
      formData.append("category", data.category);
      formData.append("location", data.location);
      formData.append("target_amount", data.target_amount.toString());
      formData.append("image", data.image);
      if (data.status) formData.append("status", data.status);
      if (data.start_date) formData.append("start_date", data.start_date);
      if (data.end_date) formData.append("end_date", data.end_date);
      if (data.beneficiaries) formData.append("beneficiaries", data.beneficiaries);
      
      return api.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, formData, true, true);
    }
    
    // Otherwise use JSON
    return api.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data);
  },

  /**
   * Update project (admin only)
   * Supports both file upload and URL
   */
  updateProject: async (id: number | string, data: Partial<CreateProjectData>) => {
    // If image file is provided, use FormData
    if (data.image) {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.full_description) formData.append("full_description", data.full_description);
      if (data.category) formData.append("category", data.category);
      if (data.location) formData.append("location", data.location);
      if (data.target_amount !== undefined) formData.append("target_amount", data.target_amount.toString());
      formData.append("image", data.image);
      if (data.status) formData.append("status", data.status);
      if (data.start_date) formData.append("start_date", data.start_date);
      if (data.end_date) formData.append("end_date", data.end_date);
      if (data.beneficiaries) formData.append("beneficiaries", data.beneficiaries);
      
      return api.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), formData, true, true);
    }
    
    // Otherwise use JSON
    return api.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
  },

  /**
   * Delete project (admin only)
   */
  deleteProject: async (id: number | string) => {
    return api.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },

  /**
   * Add project update (admin only)
   */
  addUpdate: async (id: number | string, data: { title: string; content: string }) => {
    return api.post<ProjectUpdate>(API_ENDPOINTS.PROJECTS.ADD_UPDATE(id), data);
  },

  /**
   * Get project updates
   */
  getUpdates: async (id: number | string) => {
    return api.get<ProjectUpdate[]>(API_ENDPOINTS.PROJECTS.GET_UPDATES(id), false);
  },

  /**
   * Add project gallery image (admin only)
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
      
      return api.post<ProjectGallery>(API_ENDPOINTS.PROJECTS.ADD_GALLERY(id), formData, true, true);
    }
    
    // Otherwise use JSON with image_url
    return api.post<ProjectGallery>(API_ENDPOINTS.PROJECTS.ADD_GALLERY(id), data);
  },

  /**
   * Get project gallery
   */
  getGallery: async (id: number | string) => {
    return api.get<ProjectGallery[]>(API_ENDPOINTS.PROJECTS.GET_GALLERY(id), false);
  },

  /**
   * Delete project gallery image (admin only)
   */
  deleteGalleryImage: async (id: number | string, galleryId: number | string) => {
    return api.delete(API_ENDPOINTS.PROJECTS.DELETE_GALLERY(id, galleryId));
  },
};

