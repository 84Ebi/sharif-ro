/**
 * Admin API endpoint for managing verification requests
 * GET /api/admin/verifications - List all verifications with optional filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { Query } from 'node-appwrite'

export async function GET(request: NextRequest) {
  try {
    const { databases } = createAdminClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '25')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    const queries = [
      Query.orderDesc('submittedAt'),
      Query.limit(limit),
      Query.offset(offset)
    ]

    if (status) {
      queries.push(Query.equal('status', status))
    }

    // Fetch verifications from database
    const verifications = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID!,
      queries
    )

    return NextResponse.json({
      success: true,
      data: verifications.documents,
      total: verifications.total
    })

  } catch (error) {
    console.error('Error fetching verifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch verifications'
      },
      { status: 500 }
    )
  }
}



