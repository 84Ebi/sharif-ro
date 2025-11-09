// Client-side wrapper for chat operations via API routes

export interface ChatMessage {
  $id?: string
  orderId: string
  senderId: string
  senderName: string
  senderRole: 'customer' | 'delivery'
  message: string
  createdAt?: string
  read?: boolean
}

// Extended Error type for authentication errors
export class ChatAuthError extends Error {
  isAuthError: boolean
  suggestion: string

  constructor(message: string, suggestion: string) {
    super(message)
    this.name = 'ChatAuthError'
    this.isAuthError = true
    this.suggestion = suggestion
  }
}

/**
 * Get messages for an order
 */
export async function getChatMessages(orderId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`/api/chat/${orderId}`, {
      credentials: 'include', // Ensure cookies are sent with the request
    })
    
    if (!response.ok) {
      const error = await response.json()
      const errorMessage = error.error || 'Failed to fetch chat messages'
      
      // If it's an authentication error, provide helpful guidance
      if (response.status === 401) {
        throw new ChatAuthError(
          errorMessage,
          'Please log out and log back in to sync your session with the server.'
        )
      }
      
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    return data.messages || []
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    throw error
  }
}

/**
 * Send a message in an order chat
 */
export async function sendChatMessage(
  orderId: string,
  message: string,
  senderId: string,
  senderName: string,
  senderRole: 'customer' | 'delivery'
): Promise<ChatMessage> {
  try {
    const response = await fetch(`/api/chat/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent with the request
      body: JSON.stringify({
        message,
        senderId,
        senderName,
        senderRole,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.error || 'Failed to send message'
      const errorDetails = errorData.details || ''
      
      // If it's an authentication error, provide helpful guidance
      if (response.status === 401) {
        throw new ChatAuthError(
          errorMessage,
          'Please log out and log back in to sync your session with the server.'
        )
      }
      
      // Include details in error message if available
      const fullErrorMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage
      const error = new Error(fullErrorMessage)
      // Attach details for potential use by error handlers
      if (errorDetails) {
        (error as any).details = errorDetails
      }
      throw error
    }
    
    const data = await response.json()
    return data.message
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

