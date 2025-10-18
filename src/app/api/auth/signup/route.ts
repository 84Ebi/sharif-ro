import { NextResponse } from 'next/server'
import { Client, Account, ID } from 'node-appwrite'

export async function POST(request: Request) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const account = new Account(client)

  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Create new account
    await account.create(ID.unique(), email, password, name)

    // Automatically log in after registration
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
    const message = error instanceof Error ? error.message : 'Signup failed'
    console.error('Signup error:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}