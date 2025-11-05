/**
 * Admin API endpoint for reviewing verification requests
 * POST /api/admin/verifications/[id]/review - Approve or reject a verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'

type ReviewRequest = {
  status: 'approved' | 'rejected'
  reviewNotes?: string
  reviewerId: string
  reviewerName: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: verificationId } = await params
    const body: ReviewRequest = await request.json()
    const { status, reviewNotes, reviewerId, reviewerName } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    if (!reviewerId || !reviewerName) {
      return NextResponse.json(
        { success: false, error: 'Reviewer information is required' },
        { status: 400 }
      )
    }

    const { databases, users } = createAdminClient()

    // Get the verification document
    const verification = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
      verificationId
    )

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification not found' },
        { status: 404 }
      )
    }

    // Update verification status
    const updatedVerification = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
      verificationId,
      {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerId,
        reviewNotes: reviewNotes || ''
      }
    )

    // If approved, update user's emailVerification status
    if (status === 'approved') {
      try {
        await users.updateEmailVerification(verification.userId, true)
      } catch (error) {
        console.error('Failed to update user email verification:', error)
        // Continue even if this fails, the verification is still marked as approved
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedVerification,
      message: `Verification ${status} successfully`
    })

  } catch (error) {
    console.error('Error reviewing verification:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to review verification'
      },
      { status: 500 }
    )
  }
}



