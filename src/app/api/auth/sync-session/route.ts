/**
 * Sync Session API Route
 * Syncs an existing client-side session to a server-side cookie
 * This is useful when a user is already logged in but the server-side cookie is missing
 */

import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/appwrite-server';
import { Client, Account } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { sessionSecret, expire } = await request.json();

        // Validate input
        if (!sessionSecret) {
            return NextResponse.json(
                { error: 'Session secret is required' },
                { status: 400 }
            );
        }

        // Verify the session is valid by trying to use it
        try {
            const client = new Client()
                .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
                .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
                .setSession(sessionSecret);
            
            const account = new Account(client);
            const user = await account.get();
            
            if (!user) {
                return NextResponse.json(
                    { error: 'Invalid session' },
                    { status: 401 }
                );
            }

            // Get session details to get the expire time
            const session = await account.getSession('current');
            const sessionExpire = expire || session?.expire || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            // Set session cookie with the provided session secret
            await setSessionCookie(sessionSecret, sessionExpire);

            return NextResponse.json({
                success: true,
                message: 'Session synced successfully'
            });
        } catch (verifyError) {
            console.error('Session verification error:', verifyError);
            return NextResponse.json(
                { error: 'Invalid session' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Sync session error:', error);
        
        const message = error instanceof Error ? error.message : 'Failed to sync session';
        
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

