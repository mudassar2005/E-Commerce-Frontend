'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login' }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            console.log('🔍 ProtectedRoute - User:', user);
            console.log('🔍 ProtectedRoute - Required Role:', requiredRole);
            
            // If no user is logged in, redirect to login
            if (!user) {
                router.push(redirectTo);
                return;
            }

            // If a specific role is required and user doesn't have it
            if (requiredRole && user.role !== requiredRole) {
                console.log('🔍 ProtectedRoute - Role mismatch, redirecting...');
                // Redirect based on user role
                if (user.role === 'admin') {
                    router.push('/admin');
                } else if (user.role === 'vendor') {
                    console.log('🔍 ProtectedRoute - Vendor isApproved:', user.isApproved);
                    if (user.isApproved) {
                        router.push('/vendor/dashboard');
                    } else {
                        router.push('/vendor/pending');
                    }
                } else {
                    router.push('/');
                }
                return;
            }

            // Special handling for vendor role - check approval status
            if (requiredRole === 'vendor' && user.role === 'vendor' && !user.isApproved) {
                console.log('🔍 ProtectedRoute - Vendor not approved, redirecting to pending...');
                router.push('/vendor/pending');
                return;
            }
            
            console.log('🔍 ProtectedRoute - Access granted');
        }
    }, [user, loading, requiredRole, router, redirectTo]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if user is not authenticated or doesn't have required role
    if (!user || (requiredRole && user.role !== requiredRole)) {
        return null;
    }

    // Don't render vendor dashboard if vendor is not approved
    if (requiredRole === 'vendor' && user.role === 'vendor' && !user.isApproved) {
        return null;
    }

    return children;
}