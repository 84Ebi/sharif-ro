import { databases, Query } from '@/lib/appwrite'
import { NextRequest } from 'next/server'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68e8f87e0003da022cc5'
const EXCHANGE_COLLECTION_ID = 'exchange_listings'

// PATCH /api/exchange/listings/[id] - Update listing (flag, purchase, confirm payment)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { action } = body
    
    // Get current listing
    const currentListing = await databases.getDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      id
    )
    
    let updateData: any = {}
    
    switch (action) {
      case 'flag':
        // Report/flag listing
        if (!body.reason) {
          return Response.json(
            { error: 'Flag reason is required' },
            { status: 400 }
          )
        }
        
        const currentFlagCount = currentListing.flagCount || 0
        const currentFlagReasons = currentListing.flagReasons || []
        
        updateData = {
          flagCount: currentFlagCount + 1,
          flagReasons: [...currentFlagReasons, body.reason],
        }
        
        // Auto-hide if flagCount reaches 3
        if (updateData.flagCount >= 3) {
          updateData.status = 'flagged'
        }
        break
        
      case 'purchase':
        // Buyer initiates purchase
        if (!body.buyerId) {
          return Response.json(
            { error: 'Buyer ID is required' },
            { status: 400 }
          )
        }
        
        if (currentListing.status !== 'active') {
          return Response.json(
            { error: 'Listing is not available for purchase' },
            { status: 400 }
          )
        }
        
        updateData = {
          buyerId: body.buyerId,
          status: 'sold', // Using 'sold' as 'pending_payment' is not in allowed values
        }
        break
        
      case 'confirm_payment':
        // Seller confirms payment received
        if (!body.sellerId || body.sellerId !== currentListing.userId) {
          return Response.json(
            { error: 'Only the seller can confirm payment' },
            { status: 403 }
          )
        }
        
        updateData = {
          status: 'sold',
          paymentConfirmedAt: new Date().toISOString(),
        }
        break
        
      case 'cancel':
        // Seller cancels listing
        if (!body.userId || body.userId !== currentListing.userId) {
          return Response.json(
            { error: 'Only the seller can cancel the listing' },
            { status: 403 }
          )
        }
        
        updateData = {
          status: 'cancelled',
        }
        break
        
      case 'expire':
        // System or manual expiration
        updateData = {
          status: 'expired',
        }
        break
        
      default:
        return Response.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    const updatedListing = await databases.updateDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      id,
      updateData
    )
    
    return Response.json({ listing: updatedListing }, { status: 200 })
  } catch (error) {
    console.error('Error updating exchange listing:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Failed to update listing: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// DELETE /api/exchange/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Get current listing to verify ownership
    const currentListing = await databases.getDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      id
    )
    
    if (currentListing.userId !== userId) {
      return Response.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      )
    }
    
    await databases.deleteDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      id
    )
    
    return Response.json({ message: 'Listing deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting exchange listing:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Failed to delete listing: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// GET /api/exchange/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const listing = await databases.getDocument(
      DATABASE_ID,
      EXCHANGE_COLLECTION_ID,
      id
    )
    
    return Response.json({ listing }, { status: 200 })
  } catch (error) {
    console.error('Error fetching exchange listing:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { error: `Failed to fetch listing: ${errorMessage}` },
      { status: 500 }
    )
  }
}
