/**
 * Appwrite Server Configuration
 * This file sets up the Appwrite SDK for server-side operations (API routes)
 */

import { Client, Account, Users, Databases, Storage } from 'node-appwrite';
import { cookies } from 'next/headers';

// Environment variables validation
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;

/**
 * Creates a server client with API key for admin operations
 */
export function createAdminClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(APPWRITE_API_KEY);

    return {
        client,
        account: new Account(client),
        users: new Users(client),
        databases: new Databases(client),
        storage: new Storage(client),
    };
}

/**
 * Creates a session client using the user's session cookie
 * This allows server-side operations on behalf of the authenticated user
 */
export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);

    // Get session from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(`a_session_${APPWRITE_PROJECT_ID}`);

    if (!sessionCookie?.value) {
        throw new Error('No session found');
    }

    client.setSession(sessionCookie.value);

    return {
        client,
        account: new Account(client),
        databases: new Databases(client),
        storage: new Storage(client),
    };
}

/**
 * Get the current authenticated user from session
 */
export async function getAuthenticatedUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        console.error('Failed to get authenticated user:', error);
        return null;
    }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(sessionSecret: string, expire: string) {
    const cookieStore = await cookies();
    const cookieName = `a_session_${APPWRITE_PROJECT_ID}`;
    
    cookieStore.set(cookieName, sessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(expire),
    });
}

/**
 * Delete session cookie
 */
export async function deleteSessionCookie() {
    const cookieStore = await cookies();
    const cookieName = `a_session_${APPWRITE_PROJECT_ID}`;
    
    cookieStore.delete(cookieName);
}

export const APPWRITE_SERVER_CONFIG = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID,
} as const;


