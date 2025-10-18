import { NextResponse } from 'next/server'
import { Client, Account } from 'node-appwrite'

export async function POST(request: Request) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const account = new Account(client)

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Delete any existing sessions
    await account.deleteSessions()

    // Create new session
    const session = await account.createEmailPasswordSession(email, password)

    // Set the session cookie
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
    const cookieName = `a_session_${projectId}`

    const response = NextResponse.json({ success: true, session })

    response.cookies.set(cookieName, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(session.expire),
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    console.error('Login error:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}