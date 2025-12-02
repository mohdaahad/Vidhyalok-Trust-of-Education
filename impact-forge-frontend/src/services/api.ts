/**
 * Base API Configuration and HTTP Methods
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
    token?: string;
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export interface ApiError {
    message: string;
    errors?: any[];
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Get authorization token from localStorage
     */
    private getToken(): string | null {
        return localStorage.getItem("token");
    }

    /**
     * Get headers with authentication
     */
    private getHeaders(includeAuth: boolean = true): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const data = await response.json();

        if (!response.ok) {
            throw {
                message: data.message || "An error occurred",
                errors: data.errors || [],
                status: response.status,
            } as ApiError & { status: number };
        }

        return data;
    }

    /**
     * GET request
     */
    async get<T = any>(
        endpoint: string,
        includeAuth: boolean = true
    ): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "GET",
            headers: this.getHeaders(includeAuth),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * POST request
     */
    async post<T = any>(
        endpoint: string,
        data?: any,
        includeAuth: boolean = true,
        isFormData: boolean = false
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {};

        // For FormData, don't set Content-Type (browser will set it with boundary)
        if (!isFormData) {
            Object.assign(headers, this.getHeaders(includeAuth));
        } else {
            // For FormData, only add Authorization header if needed
            if (includeAuth) {
                const token = this.getToken();
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers,
            body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * PUT request
     */
    async put<T = any>(
        endpoint: string,
        data?: any,
        includeAuth: boolean = true,
        isFormData: boolean = false
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {};

        // For FormData, don't set Content-Type (browser will set it with boundary)
        if (!isFormData) {
            Object.assign(headers, this.getHeaders(includeAuth));
        } else {
            // For FormData, only add Authorization header if needed
            if (includeAuth) {
                const token = this.getToken();
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            headers,
            body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * PATCH request
     */
    async patch<T = any>(
        endpoint: string,
        data?: any,
        includeAuth: boolean = true
    ): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PATCH",
            headers: this.getHeaders(includeAuth),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    /**
     * DELETE request
     */
    async delete<T = any>(
        endpoint: string,
        includeAuth: boolean = true
    ): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
            headers: this.getHeaders(includeAuth),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * Upload file (multipart/form-data)
     */
    async upload<T = any>(
        endpoint: string,
        formData: FormData,
        includeAuth: boolean = true
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {};

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });

        return this.handleResponse<T>(response);
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export methods directly for convenience
export const api = {
    get: <T = any>(endpoint: string, includeAuth?: boolean) =>
        apiClient.get<T>(endpoint, includeAuth),
    post: <T = any>(endpoint: string, data?: any, includeAuth?: boolean, isFormData?: boolean) =>
        apiClient.post<T>(endpoint, data, includeAuth, isFormData),
    put: <T = any>(endpoint: string, data?: any, includeAuth?: boolean, isFormData?: boolean) =>
        apiClient.put<T>(endpoint, data, includeAuth, isFormData),
    patch: <T = any>(endpoint: string, data?: any, includeAuth?: boolean) =>
        apiClient.patch<T>(endpoint, data, includeAuth),
    delete: <T = any>(endpoint: string, includeAuth?: boolean) =>
        apiClient.delete<T>(endpoint, includeAuth),
    upload: <T = any>(endpoint: string, formData: FormData, includeAuth?: boolean) =>
        apiClient.upload<T>(endpoint, formData, includeAuth),
};

