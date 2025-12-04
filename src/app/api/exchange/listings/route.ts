import { databases, ID, Query } from '@/lib/appwrite'
import { NextRequest } from 'next/server'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68e8f87e0003da022cc5'
const EXCHANGE_COLLECTION_ID = 'exchange_listings' // Will need to be created in Appwrite

// Helper function to calculate expiration time (2 PM today or tomorrow)
function calculateExpirationTime(): string {
  const now = new Date()
  const today2PM = new Date()
  today2PM.setHours(14, 0, 0, 0)
  
  // If it's past 2:00:00 PM today, expire tomorrow at 2 PM
  if (now.getTime() > today2PM.getTime()) {
    const tomorrow2PM = new Date(today2PM)
    tomorrow2PM.setDate(tomorrow2PM.getDate() + 1)
    return tomorrow2PM.toISOString()
  }
  
  // Otherwise expire today at 2 PM
  return today2PM.toISOString()
}

// GET /api/exchange/listings - Get active listings with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const buyerId = searchParams.get('buyerId')
    const status = searchParams.get('status') || 'active'
    
    const queries = []
    
    if (status !== 'all') {
      queries.push(Query.equal('status', status))
    }
    
    // Filter out expired listings for 'active' status
    if (status === 'active') {
      const now = new Date().toISOString()
      queries.push(Query.greaterThan('expiresAt', now))
    }
    
    if (userId) {
      queries.push(Query.equal('userId', userId))
    }

    if (buyerId) {
      queries.push(Query.equal('buyerId', buyerId))
    }
    
    queries.push(Query.orderDesc('$createdAt'))
    queries.push(Query.limit(100))
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      queries
    )
    
    return Response.json({ listings: response.documents }, { status: 200 })
  } catch (error) {
    console.error('Error fetching exchange listings:', error)
    return Response.json(
      { error: 'Failed to fetch exchange listings' },
      { status: 500 }
    )
  }
}

// POST /api/exchange/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'userId',
      'userName',
      'userCardNumber',
      'itemType',
      'itemName',
      'price',
      'codeValue',
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Validate price (max 60,000 Toman)
    if (body.price > 60000) {
      return Response.json(
        { error: 'Price cannot exceed 60,000 Toman' },
        { status: 400 }
      )
    }
    
    if (body.price <= 0) {
      return Response.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }
    
    // Calculate expiration time
    const expiresAt = calculateExpirationTime()
    
    const listingData = {
      userId: body.userId,
      userName: body.userName,
      userCardNumber: body.userCardNumber,
      itemType: body.itemType,
      itemName: body.itemName,
      description: body.description || '',
      price: parseFloat(body.price),
      status: 'active',
      flagCount: 0,
      flagReasons: [],
      codeValue: body.codeValue,
      expiresAt: expiresAt,
    }
    
    const listing = await databases.createDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      ID.unique(),
      listingData
    )
    
    return Response.json({ listing }, { status: 201 })
  } catch (error) {
    console.error('Error creating exchange listing:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Failed to create listing: ${errorMessage}` },
      { status: 500 }
    )
  }
}
