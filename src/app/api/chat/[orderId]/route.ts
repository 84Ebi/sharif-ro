import { NextRequest, NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite-server'
import { Query, ID } from 'node-appwrite'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const CHAT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID

// GET /api/chat/[orderId] - Get messages for an order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    
    // Try to create session client and get user
    let databases, account, user
    try {
      const sessionClient = await createSessionClient()
      databases = sessionClient.databases
      account = sessionClient.account
      user = await account.get()
    } catch (sessionError) {
      // If session not found, return 401
      if (sessionError instanceof Error && sessionError.message === 'No session found') {
        return NextResponse.json(
          { error: 'Not authenticated. Please log in.' },
          { status: 401 }
        )
      }
      throw sessionError
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify user has access to this order (either customer or delivery person)
    // First, get the order to check ownership
    const orders = await databases.listDocuments(
      DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      [Query.equal('$id', orderId)]
    )

    if (orders.documents.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orders.documents[0]
    
    // Check if user is customer or delivery person for this order
    // Convert to strings for comparison to ensure type consistency
    const isCustomer = String(order.userId) === String(user.$id)
    const isDeliveryPerson = order.deliveryPersonId ? String(order.deliveryPersonId) === String(user.$id) : false
    
    if (!isCustomer && !isDeliveryPerson) {
      return NextResponse.json(
        { error: 'Unauthorized to access this chat' },
        { status: 403 }
      )
    }

    // Check if chat collection is configured
    if (!CHAT_COLLECTION_ID) {
      return NextResponse.json(
        { error: 'Chat feature is not configured. Please set NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID.' },
        { status: 500 }
      )
    }

    // Get messages for this order
    // Use $createdAt (Appwrite's built-in timestamp) for ordering
    const messages = await databases.listDocuments(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      [
        Query.equal('orderId', orderId),
        Query.orderAsc('$createdAt'),
      ]
    )

    // Normalize messages: map $createdAt to createdAt for frontend compatibility
    const normalizedMessages = messages.documents.map((msg) => ({
      ...msg,
      createdAt: msg.$createdAt || msg.createdAt,
    }))

    // Return user's role so the frontend can use it
    const userRole = isCustomer ? 'customer' : (isDeliveryPerson ? 'delivery' : null)

    return NextResponse.json({
      success: true,
      messages: normalizedMessages,
      userRole, // Include the user's role for this order
      orderUserId: order.userId,
      orderDeliveryPersonId: order.deliveryPersonId,
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    
    // If it's an authentication error, return 401
    if (error instanceof Error && (error.message === 'No session found' || error.message.includes('Not authenticated'))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated. Please log in.',
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch chat messages',
      },
      { status: 500 }
    )
  }
}

// POST /api/chat/[orderId] - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    
    // Try to create session client and get user
    let databases, account, user
    try {
      const sessionClient = await createSessionClient()
      databases = sessionClient.databases
      account = sessionClient.account
      user = await account.get()
    } catch (sessionError) {
      // If session not found, return 401
      if (sessionError instanceof Error && sessionError.message === 'No session found') {
        return NextResponse.json(
          { error: 'Not authenticated. Please log in.' },
          { status: 401 }
        )
      }
      throw sessionError
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, senderId, senderName } = body

    if (!message || !senderId || !senderName) {
      return NextResponse.json(
        { error: 'Missing required fields: message, senderId, and senderName are required' },
        { status: 400 }
      )
    }

    // Verify user matches senderId
    if (senderId !== user.$id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Verify user has access to this order
    const orders = await databases.listDocuments(
      DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      [Query.equal('$id', orderId)]
    )

    if (orders.documents.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orders.documents[0]
    // Convert to strings for comparison to ensure type consistency
    const isCustomer = String(order.userId) === String(user.$id)
    const isDeliveryPerson = order.deliveryPersonId ? String(order.deliveryPersonId) === String(user.$id) : false
    
    if (!isCustomer && !isDeliveryPerson) {
      return NextResponse.json(
        { error: 'Unauthorized to send messages in this chat' },
        { status: 403 }
      )
    }

    // Derive senderRole from order data (server-side determination)
    // This is the single source of truth - we don't trust client-provided senderRole
    const senderRole = isCustomer ? 'customer' : 'delivery'

    // Check if chat collection is configured
    if (!CHAT_COLLECTION_ID) {
      return NextResponse.json(
        { error: 'Chat feature is not configured. Please set NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID.' },
        { status: 500 }
      )
    }

    // Create message
    // Note: $createdAt is automatically set by Appwrite, so we don't need to set it manually
    const chatMessage = await databases.createDocument(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      ID.unique(),
      {
        orderId,
        senderId,
        senderName,
        senderRole,
        message,
        read: false,
        // createdAt is handled by Appwrite's $createdAt automatically
      }
    )

    // Normalize message: map $createdAt to createdAt for frontend compatibility
    const normalizedMessage = {
      ...chatMessage,
      createdAt: chatMessage.$createdAt || chatMessage.createdAt,
    }

    return NextResponse.json({
      success: true,
      message: normalizedMessage,
    })
  } catch (error) {
    console.error('Error sending chat message:', error)
    
    // If it's an authentication error, return 401
    if (error instanceof Error && (error.message === 'No session found' || error.message.includes('Not authenticated'))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated. Please log in.',
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    )
  }
}

