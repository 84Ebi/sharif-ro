/**
 * Login API Route
 * Authenticates a user and creates a session
 */

import { NextResponse } from 'next/server';
import { createAdminClient, setSessionCookie } from '@/lib/appwrite-server';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const { account } = createAdminClient();

        // Create email password session
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie
        await setSessionCookie(session.secret, session.expire);

        // Get user data
        const user = await account.get();

        return NextResponse.json({
            success: true,
            user: {
                $id: user.$id,
                name: user.name,
                email: user.email,
                prefs: user.prefs,
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        
        const message = error instanceof Error ? error.message : 'Login failed';
        
        // Handle specific authentication errors
        if (message.includes('Invalid credentials') || 
            message.includes('user') || 
            message.includes('password')) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Login failed. Please try again.' },
            { status: 500 }
        );
    }
}
