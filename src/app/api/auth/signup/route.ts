/**
 * Signup API Route
 * Creates a new user account and establishes a session
 */

import { NextResponse } from 'next/server';
import { createAdminClient, setSessionCookie } from '@/lib/appwrite-server';
import { ID } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const { account } = createAdminClient();

        // Create user account
        await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        // Create email session for the new user
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie
        await setSessionCookie(session.secret, session.expire);

        return NextResponse.json({
            success: true,
            session: {
                $id: session.$id,
                userId: session.userId,
            },
            message: 'Account created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        
        const message = error instanceof Error ? error.message : 'Failed to create account';
        
        // Handle specific Appwrite errors
        if (message.includes('user already exists')) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
