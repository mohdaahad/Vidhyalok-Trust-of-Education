/**
 * Image URL Utility
 * Converts relative image URLs from backend to full URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get full image URL from relative path
 * @param imageUrl - Relative image URL from backend (e.g., /uploads/images/file.jpg)
 * @returns Full image URL
 */
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return ""; // Return empty string if no image URL
  }

  // If already a full URL (starts with http:// or https://), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Remove /api from API_BASE_URL to get base server URL
  const baseUrl = API_BASE_URL.replace("/api", "");

  // Ensure imageUrl starts with /
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  // Return full URL
  return `${baseUrl}${path}`;
};


