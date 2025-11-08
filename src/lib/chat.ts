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
      // Return a more descriptive error message
      const errorMessage = error.error || 'Failed to fetch chat messages'
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
      const error = await response.json()
      // Return a more descriptive error message
      const errorMessage = error.error || 'Failed to send message'
      throw new Error(errorMessage)
    }
    
    const data = await response.json()
    return data.message
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

