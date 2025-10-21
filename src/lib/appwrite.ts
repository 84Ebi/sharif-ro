/**
 * Appwrite Client Configuration
 * This file sets up the Appwrite client for browser-side authentication and services
 */

import { Client, Account, Databases, Query, ID, Storage } from 'appwrite';

// Validate environment variables
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68dacad8003e7b0deb82';

// Initialize Appwrite client
export const client = new Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export utilities
export { ID, Query };

// Export constants for reuse
export const APPWRITE_CONFIG = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID,
} as const;