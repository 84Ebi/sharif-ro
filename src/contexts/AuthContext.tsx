'use client'

/**
 * Authentication Context
 * Provides global authentication state and methods across the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { account, ID } from '../lib/appwrite';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';

// Type definitions
export interface User extends Models.User<Models.Preferences> {
    prefs: UserPreferences;
}

export interface UserPreferences {
    studentCode?: string;
    credit?: number;
    phone?: string;
    profileComplete?: boolean;
    role?: 'customer' | 'delivery' | 'courier';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    
    // Auth methods
    signup: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    
    // Account update methods
    updateName: (name: string) => Promise<void>;
    updateEmail: (email: string, password: string) => Promise<void>;
    updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
    updatePhone: (phone: string, password: string) => Promise<void>;
    updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
    
    // Session management
    refreshUser: () => Promise<void>;
    checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    /**
     * Check if user has an active session and load user data
     */
    const checkSession = useCallback(async (): Promise<boolean> => {
        try {
            const currentUser = await account.get();
            setUser(currentUser as User);
            setError(null);
            return true;
        } catch {
            console.log('No active session');
            setUser(null);
            return false;
        }
    }, []);

    /**
     * Refresh user data from server
     */
    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser as User);
            setError(null);
        } catch (err) {
            console.error('Failed to refresh user:', err);
            setUser(null);
        }
    }, []);

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            await checkSession();
            setLoading(false);
        };
        initAuth();
    }, [checkSession]);

    /**
     * Sign up a new user
     */
    const signup = useCallback(async (email: string, password: string, name: string) => {
        try {
            setError(null);
            setLoading(true);

            // Create account
            await account.create(ID.unique(), email, password, name);

            // Automatically log in after signup
            await account.createEmailPasswordSession(email, password);

            // Refresh user data
            await refreshUser();

            // Redirect to complete profile
            router.push('/auth/details');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [router, refreshUser]);

    /**
     * Log in an existing user
     */
    const login = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);

            // Delete any existing sessions first
            try {
                await account.deleteSession('current');
            } catch {
                // No existing session, continue
            }

            // Create email session
            await account.createEmailPasswordSession(email, password);

            // Refresh user data
            await refreshUser();

            // Check for redirect URL in query params
            if (typeof window !== 'undefined') {
                const searchParams = new URLSearchParams(window.location.search);
                const redirect = searchParams.get('redirect');
                
                // Redirect to the original URL or role selection
                if (redirect && redirect.startsWith('/')) {
                    router.push(redirect);
                } else {
                    router.push('/role');
                }
            } else {
                router.push('/role');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            console.error('Login error:', err);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, [router, refreshUser]);

    /**
     * Log out the current user
     */
    const logout = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            // Delete current session
            await account.deleteSession('current');

            // Clear user state
            setUser(null);

            // Clear local storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userRole');
                // Clear all Appwrite localStorage keys
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('appwrite')) {
                        localStorage.removeItem(key);
                    }
                });
            }

            // Redirect to auth page
            router.push('/auth');
        } catch (err) {
            console.error('Logout error:', err);
            // Even if logout fails on server, clear local state
            setUser(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userRole');
                // Clear all Appwrite localStorage keys
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('appwrite')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            router.push('/auth');
        } finally {
            setLoading(false);
        }
    }, [router]);

    /**
     * Update user's name
     */
    const updateName = useCallback(async (name: string) => {
        try {
            setError(null);
            await account.updateName(name);
            await refreshUser();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update name';
            setError(message);
            throw new Error(message);
        }
    }, [refreshUser]);

    /**
     * Update user's email
     */
    const updateEmail = useCallback(async (email: string, password: string) => {
        try {
            setError(null);
            await account.updateEmail(email, password);
            await refreshUser();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update email';
            setError(message);
            throw new Error(message);
        }
    }, [refreshUser]);

    /**
     * Update user's password
     */
    const updatePassword = useCallback(async (newPassword: string, oldPassword: string) => {
        try {
            setError(null);
            await account.updatePassword(newPassword, oldPassword);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update password';
            setError(message);
            throw new Error(message);
        }
    }, []);

    /**
     * Update user's phone number
     */
    const updatePhone = useCallback(async (phone: string, password: string) => {
        try {
            setError(null);
            await account.updatePhone(phone, password);
            await refreshUser();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update phone';
            setError(message);
            throw new Error(message);
        }
    }, [refreshUser]);

    /**
     * Update user preferences
     */
    const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
        try {
            setError(null);
            
            // Get current preferences and merge with new ones
            const currentPrefs = user?.prefs || {};
            const updatedPrefs = { ...currentPrefs, ...prefs };
            
            await account.updatePrefs(updatedPrefs);
            await refreshUser();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update preferences';
            setError(message);
            throw new Error(message);
        }
    }, [user, refreshUser]);

    const value: AuthContextType = React.useMemo(() => ({
        user,
        loading,
        error,
        signup,
        login,
        logout,
        updateName,
        updateEmail,
        updatePassword,
        updatePhone,
        updatePreferences,
        refreshUser,
        checkSession,
    }), [user, loading, error, signup, login, logout, updateName, updateEmail, updatePassword, updatePhone, updatePreferences, refreshUser, checkSession]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

