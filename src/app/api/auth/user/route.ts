/**
 * User API Route
 * Get and update current user information
 */

import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite-server';

/**
 * GET current user
 */
export async function GET() {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();

        return NextResponse.json({
            success: true,
            user: {
                $id: user.$id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                emailVerification: user.emailVerification,
                phoneVerification: user.phoneVerification,
                prefs: user.prefs,
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        
        return NextResponse.json(
            { error: 'Failed to get user information' },
            { status: 401 }
        );
    }
}

/**
 * PATCH update user information
 */
export async function PATCH(request: Request) {
    try {
        const { account } = await createSessionClient();
        const body = await request.json();

        const { name, email, password, phone, phonePassword, prefs } = body;

        // Update name if provided
        if (name) {
            await account.updateName(name);
        }

        // Update email if provided (requires password)
        if (email && password) {
            await account.updateEmail(email, password);
        }

        // Update phone if provided (requires password)
        if (phone && phonePassword) {
            await account.updatePhone(phone, phonePassword);
        }

        // Update preferences if provided
        if (prefs) {
            await account.updatePrefs(prefs);
        }

        // Get updated user
        const updatedUser = await account.get();

        return NextResponse.json({
            success: true,
            user: {
                $id: updatedUser.$id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                emailVerification: updatedUser.emailVerification,
                phoneVerification: updatedUser.phoneVerification,
                prefs: updatedUser.prefs,
            },
            message: 'User information updated successfully'
        });

    } catch (error) {
        console.error('Update user error:', error);
        
        const message = error instanceof Error ? error.message : 'Failed to update user information';
        
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

