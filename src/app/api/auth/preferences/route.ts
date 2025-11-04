/**
 * User Preferences API Route
 * Get and update user preferences
 */

import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite-server';

/**
 * GET user preferences
 */
export async function GET() {
    try {
        const { account } = await createSessionClient();
        const prefs = await account.getPrefs();

        return NextResponse.json({
            success: true,
            preferences: prefs
        });

    } catch (error) {
        console.error('Get preferences error:', error);
        
        return NextResponse.json(
            { error: 'Failed to get preferences' },
            { status: 401 }
        );
    }
}

/**
 * PUT/PATCH update user preferences
 */
export async function PUT(request: Request) {
    try {
        const { account } = await createSessionClient();
        const preferences = await request.json();

        // Get current preferences
        const currentPrefs = await account.getPrefs();

        // Merge with new preferences
        const updatedPrefs = { ...currentPrefs, ...preferences };

        // Update preferences
        await account.updatePrefs(updatedPrefs);

        return NextResponse.json({
            success: true,
            preferences: updatedPrefs,
            message: 'Preferences updated successfully'
        });

    } catch (error) {
        console.error('Update preferences error:', error);
        
        const message = error instanceof Error ? error.message : 'Failed to update preferences';
        
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    return PUT(request);
}





