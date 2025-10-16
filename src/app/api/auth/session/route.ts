import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionSecret, expire } = await request.json()

    if (!sessionSecret || !expire) {
      return NextResponse.json({ error: 'Missing session information' }, { status: 400 })
    }

    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
    const cookieName = `a_session_${projectId}`

    const response = NextResponse.json({ success: true })
    
    response.cookies.set(cookieName, sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expire),
    })

    return response
  } catch (error) {
    console.error('Failed to set session cookie:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
