import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, expire } = await request.json();

    if (!sessionId || !expire) {
      return NextResponse.json({ error: 'Session ID and expiration are required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    
    // Set the httpOnly cookie
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expire),
    });

    return response;
  } catch (error) {
    console.error('API session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
