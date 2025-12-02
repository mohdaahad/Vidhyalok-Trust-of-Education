import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

/**
 * Admin Route Protection Component
 * Checks if user is authenticated and has admin role
 */
const AdminRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if token exists
                const token = authService.getToken();
                if (!token) {
                    setIsAuthorized(false);
                    setIsLoading(false);
                    return;
                }

                // Check if user role is admin
                const userRole = localStorage.getItem("userRole");
                if (userRole === "admin") {
                    setIsAuthorized(true);
                    setIsLoading(false);
                    return;
                }

                // Try to get user info from API to verify role
                try {
                    const response = await authService.getMe();
                    // Handle both ApiResponse and direct User object
                    const user = (response as any).data || (response as any);
                    if (user && user.role === "admin") {
                        localStorage.setItem("userRole", "admin");
                        setIsAuthorized(true);
                    } else {
                        authService.logout();
                        setIsAuthorized(false);
                    }
                } catch (error) {
                    // Token might be invalid, clear it
                    authService.logout();
                    setIsAuthorized(false);
                }
            } catch (error) {
                setIsAuthorized(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking authorization...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;

