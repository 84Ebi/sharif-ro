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
            
            // Try to get the current session to sync with server cookie
            try {
                const session = await account.getSession('current');
                if (session) {
                    // Check if server-side session exists
                    try {
                        const sessionCheck = await fetch('/api/auth/session', {
                            method: 'GET',
                            credentials: 'include',
                        });
                        
                        if (!sessionCheck.ok) {
                            // Server-side session doesn't exist, but client-side does
                            // Try to sync the session using the session secret
                            try {
                                // Try to get session secret from the session object
                                // Note: Appwrite Session may have secret property, but it's not in the type definition
                                // We check for it using a type assertion with Record type
                                const sessionRecord = session as Models.Session & Record<string, unknown>;
                                const sessionSecret = (sessionRecord.secret as string | undefined) || 
                                                     (sessionRecord.$secret as string | undefined) || 
                                                     null;
                                
                                // If not in session object, try to get it from the client's internal storage
                                if (!sessionSecret && typeof window !== 'undefined') {
                                    // Appwrite client SDK stores the session secret internally
                                    // We can try to access it via the client instance
                                    try {
                                        // The client might have the session stored
                                        // Check if we can get it from the account service
                                        const sessions = await account.listSessions();
                                        if (sessions.sessions && sessions.sessions.length > 0) {
                                            // Try to use the current session ID to get the secret
                                            // Note: This might not work as the secret might not be exposed
                                        }
                                    } catch {
                                        // Couldn't access sessions list
                                    }
                                }
                                
                                // If we found the session secret, try to sync it
                                if (sessionSecret) {
                                    const syncResponse = await fetch('/api/auth/sync-session', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'include',
                                        body: JSON.stringify({
                                            sessionSecret,
                                            expire: session.expire,
                                        }),
                                    });
                                    
                                    if (syncResponse.ok) {
                                        // Session synced successfully
                                    } else {
                                        const errorData = await syncResponse.json().catch(() => ({}));
                                        console.warn('Failed to sync session:', errorData);
                                        console.warn('Please log out and log back in to fix API route authentication.');
                                    }
                                } else {
                                    // Can't sync without the secret - user needs to re-login
                                    console.warn('Please log out and log back in to sync your session.');
                                }
                            } catch (syncError) {
                                console.warn('Failed to sync session:', syncError);
                                console.warn('Please log out and log back in to fix API route authentication.');
                            }
                        }
                    } catch {
                        // Session check failed, continue anyway
                    }
                }
            } catch {
                // No session or session check failed, continue
            }
            
            return true;
        } catch {
            // No active session
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

            // Create account using client-side SDK
            await account.create(ID.unique(), email, password, name);

            // First, create session on server (this sets the cookie)
            // Then create session on client to match
            try {
                const syncResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password }),
                });

                if (syncResponse.ok) {
                } else {
                    const errorData = await syncResponse.json().catch(() => ({}));
                    console.warn('Failed to create server-side session:', errorData);
                    // Continue with client-side session creation
                }
            } catch (apiError) {
                console.warn('Failed to create server-side session:', apiError);
                // Continue with client-side session creation
            }

            // Automatically log in after signup using client-side SDK
            // This ensures client-side operations work
            await account.createEmailPasswordSession(email, password);

            // Verify server-side session is set by checking the session endpoint
            try {
                const sessionCheck = await fetch('/api/auth/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!sessionCheck.ok) {
                    console.warn('Please try logging out and logging back in.');
                } else {
                }
            } catch {
                // Session check failed, but continue anyway
            }

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

            // First, create session on server (this sets the cookie)
            // Then create session on client to match
            try {
                const syncResponse = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password }),
                });

                if (syncResponse.ok) {
                } else {
                    const errorData = await syncResponse.json().catch(() => ({}));
                    console.warn('Failed to create server-side session:', errorData);
                    // Continue with client-side session creation
                }
            } catch (apiError) {
                console.warn('Failed to create server-side session:', apiError);
                // Continue with client-side session creation
            }

            // Create email session using client-side SDK (stores in localStorage)
            // This ensures client-side operations work
            await account.createEmailPasswordSession(email, password);

            // Verify server-side session is set by checking the session endpoint
            try {
                const sessionCheck = await fetch('/api/auth/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!sessionCheck.ok) {
                    console.warn('Please try logging out and logging back in.');
                } else {
                }
            } catch {
                // Session check failed, but continue anyway
            }

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

