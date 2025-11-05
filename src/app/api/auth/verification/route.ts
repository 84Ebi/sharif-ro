/**
 * User API endpoint for checking their own verification status
 * GET /api/auth/verification - Get current user's verification status
 */

import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite-server'
import { Query } from 'node-appwrite'

export async function GET() {
  try {
    const { account, databases } = await createSessionClient()

    // Get current user
    const user = await account.get()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's verification status
    const verifications = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
      [
        Query.equal('userId', user.$id),
        Query.orderDesc('submittedAt'),
        Query.limit(1)
      ]
    )

    if (verifications.documents.length === 0) {
      return NextResponse.json({
        success: true,
        hasVerification: false,
        data: null
      })
    }

    const verification = verifications.documents[0]

    return NextResponse.json({
      success: true,
      hasVerification: true,
      data: {
        status: verification.status,
        submittedAt: verification.submittedAt,
        reviewedAt: verification.reviewedAt,
        reviewNotes: verification.reviewNotes
      }
    })

  } catch (error) {
    console.error('Error fetching verification status:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch verification status'
      },
      { status: 500 }
    )
  }
}



