'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const { data } = await api.get('/auth/me');
                console.log('🔍 AuthContext - User data from /auth/me:', data);
                setUser(data);
            }
        } catch (error) {
            console.error('Session check failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            return data;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            // Clear any existing tokens before login attempt
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Make the login request using axios directly to avoid interceptor issues
            const { data } = await axios.post('http://localhost:3001/auth/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(data.user);
            console.log('🔍 AuthContext - User data from login:', data.user);
            
            // Redirect based on user role and approval status
            if (data.user.role === 'admin') {
                router.push('/admin');
            } else if (data.user.role === 'vendor') {
                console.log('🔍 AuthContext - Vendor isApproved:', data.user.isApproved);
                if (data.user.isApproved) {
                    router.push('/vendor/dashboard');
                } else {
                    router.push('/vendor/pending');
                }
            } else {
                router.push('/');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            // Clear any tokens on login failure
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('pendingVerificationEmail', userData.email);
            setUser(data.user);
            return { success: true, requiresVerification: !data.user.isEmailVerified, email: userData.email };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const sendVerificationOtp = async (email) => {
        try {
            await api.post('/auth/send-verification-otp', { email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to send OTP'
            };
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            await api.post('/auth/verify-email', { email, otp });
            localStorage.removeItem('pendingVerificationEmail');
            await checkUserLoggedIn();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid OTP'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: checkUserLoggedIn, sendVerificationOtp, verifyEmail, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
