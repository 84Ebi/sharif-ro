/**
 * Session API Route
 * Gets current session and user information
 */

import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite-server';

export async function GET() {
    try {
        // Get session client
        const { account } = await createSessionClient();

        // Get current user
        const user = await account.get();

        // Get current session
        const session = await account.getSession('current');

        return NextResponse.json({
            authenticated: true,
            user: {
                $id: user.$id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                emailVerification: user.emailVerification,
                phoneVerification: user.phoneVerification,
                prefs: user.prefs,
            },
            session: {
                $id: session.$id,
                provider: session.provider,
                expire: session.expire,
            }
        });

    } catch (error) {
        console.error('Session check error:', error);
        
        return NextResponse.json(
            { 
                authenticated: false,
                error: 'No active session' 
            },
            { status: 401 }
        );
    }
}
