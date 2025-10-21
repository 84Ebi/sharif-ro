/**
 * Password Management API Route
 * Update or reset password
 */

import { NextResponse } from 'next/server';
import { createSessionClient, createAdminClient } from '@/lib/appwrite-server';

/**
 * PATCH - Update password (requires old password)
 */
export async function PATCH(request: Request) {
    try {
        const { account } = await createSessionClient();
        const { newPassword, oldPassword } = await request.json();

        // Validate input
        if (!newPassword) {
            return NextResponse.json(
                { error: 'New password is required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Update password
        await account.updatePassword(newPassword, oldPassword);

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update password error:', error);
        
        const message = error instanceof Error ? error.message : 'Failed to update password';
        
        if (message.includes('password')) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

/**
 * POST - Request password recovery
 */
export async function POST(request: Request) {
    try {
        const { account } = createAdminClient();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Send recovery email
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`;
        await account.createRecovery(email, redirectUrl);

        return NextResponse.json({
            success: true,
            message: 'Password recovery email sent'
        });

    } catch (error) {
        console.error('Password recovery error:', error);
        
        // Don't reveal if email exists for security
        return NextResponse.json({
            success: true,
            message: 'If the email exists, a recovery link has been sent'
        });
    }
}

