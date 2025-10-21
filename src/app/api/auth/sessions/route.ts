/**
 * Sessions Management API Route
 * List and manage user sessions
 */

import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite-server';

/**
 * GET - List all active sessions
 */
export async function GET() {
    try {
        const { account } = await createSessionClient();
        const sessions = await account.listSessions();

        return NextResponse.json({
            success: true,
            sessions: sessions.sessions.map(session => ({
                $id: session.$id,
                provider: session.provider,
                clientName: session.clientName,
                clientType: session.clientType,
                clientVersion: session.clientVersion,
                ip: session.ip,
                osName: session.osName,
                osVersion: session.osVersion,
                deviceName: session.deviceName,
                current: session.current,
                expire: session.expire,
                $createdAt: session.$createdAt,
            })),
            total: sessions.total
        });

    } catch (error) {
        console.error('List sessions error:', error);
        
        return NextResponse.json(
            { error: 'Failed to list sessions' },
            { status: 401 }
        );
    }
}

/**
 * DELETE - Delete all sessions (logout from all devices)
 */
export async function DELETE() {
    try {
        const { account } = await createSessionClient();
        
        // Delete all sessions except current
        await account.deleteSessions();

        return NextResponse.json({
            success: true,
            message: 'All sessions deleted successfully'
        });

    } catch (error) {
        console.error('Delete sessions error:', error);
        
        return NextResponse.json(
            { error: 'Failed to delete sessions' },
            { status: 500 }
        );
    }
}


