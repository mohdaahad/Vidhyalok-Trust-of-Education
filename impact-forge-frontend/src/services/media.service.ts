/**
 * Media Service
 * Handles image and video uploads
 */

import { api } from "./api";
import { API_ENDPOINTS } from "./web";

export interface UploadResponse {
  url: string;
  public_id: string;
  width?: number;
  height?: number;
}

export const mediaService = {
  /**
   * Upload image
   */
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.upload<UploadResponse>(
      API_ENDPOINTS.MEDIA.UPLOAD_IMAGE,
      formData
    );

    return response.data!;
  },
};


