/**
 * Logout API Route
 * Deletes the current session and clears the session cookie
 */

import { NextResponse } from 'next/server';
import { createSessionClient, deleteSessionCookie } from '@/lib/appwrite-server';

export async function POST() {
    try {
        // Get session client
        const { account } = await createSessionClient();

        // Delete current session
        await account.deleteSession('current');

        // Delete session cookie
        await deleteSessionCookie();

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        
        // Even if there's an error, clear the cookie
        await deleteSessionCookie();

        return NextResponse.json({
            success: true,
            message: 'Logged out'
        });
    }
}

export async function DELETE() {
    // Support DELETE method as well
    return POST();
}


