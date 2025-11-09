'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getChatMessages, sendChatMessage, ChatMessage, ChatError, ChatMessagesResponse } from '@/lib/chat'
import { useI18n } from '@/lib/i18n'
import { useNotification } from '@/contexts/NotificationContext'
import { client } from '@/lib/appwrite'

interface OrderChatProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  customerId: string
  deliveryPersonId?: string
}

export default function OrderChat({ orderId, isOpen, onClose, customerId, deliveryPersonId }: OrderChatProps) {
  const { user } = useAuth()
  const { t, locale } = useI18n()
  const { showNotification } = useNotification()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null)
  const [serverUserRole, setServerUserRole] = useState<'customer' | 'delivery' | null>(null)

  // Function to determine user's role based on their relationship to the order
  // Prefer server-determined role (from GET /api/chat) as it's the source of truth
  // Fall back to client-side determination if server role is not available
  const getUserRole = (): 'customer' | 'delivery' => {
    // Use server-determined role if available (this is the most reliable)
    if (serverUserRole) {
      return serverUserRole
    }

    if (!user?.$id) {
      console.error('Cannot determine role: user is not authenticated')
      return 'customer' // Default fallback
    }

    // Fallback to client-side determination (same logic as API)
    // Convert to strings for comparison to avoid type issues
    // Use EXACTLY the same comparison logic as the API (no trim, just String conversion)
    const userId = String(user.$id)
    const custId = String(customerId)
    const delPersonId = deliveryPersonId ? String(deliveryPersonId) : null
    
    // Check if user is the customer (matches order.userId) - API logic: String(order.userId) === String(user.$id)
    const isCustomer = userId === custId
    
    // Check if user is the delivery person (matches order.deliveryPersonId) - API logic: order.deliveryPersonId ? String(order.deliveryPersonId) === String(user.$id) : false
    const isDeliveryPerson = delPersonId ? userId === delPersonId : false
    
    // Determine role based on actual order data (same logic as API)
    // Priority: customer first, then delivery person
    if (isCustomer) {
      return 'customer'
    }
    
    if (isDeliveryPerson) {
      return 'delivery'
    }
    
    // If neither matches, this is an error - user shouldn't have access
    console.error('User role cannot be determined for chat. User does not match customer or delivery person.', {
      userId,
      customerId: custId,
      deliveryPersonId: delPersonId,
      isCustomer,
      isDeliveryPerson,
      serverUserRole,
      rawValues: {
        user$id: user.$id,
        customerIdProp: customerId,
        deliveryPersonIdProp: deliveryPersonId
      }
    })
    
    // The API will reject this, which is correct behavior
    // But we need to return something - use customer as it's the most restrictive
    // The API validation will catch this and return proper error
    return 'customer'
  }
  
  const userName = user?.name || ''

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load messages and subscribe to real-time updates
  useEffect(() => {
    if (!isOpen || !orderId || !user) {
      // Reset server role when chat closes
      if (!isOpen) {
        setServerUserRole(null)
      }
      return
    }

    const loadMessages = async () => {
      try {
        setLoading(true)
        // Reset server role before fetching to ensure fresh data
        setServerUserRole(null)
        
        const response: ChatMessagesResponse = await getChatMessages(orderId)
        setMessages(response.messages)
        
        // Use the server-determined role if available (this is the source of truth)
        if (response.userRole) {
          console.log('Server determined user role:', response.userRole, {
            orderId,
            orderUserId: response.orderUserId,
            orderDeliveryPersonId: response.orderDeliveryPersonId,
            currentUserId: user?.$id,
            clientCustomerId: customerId,
            clientDeliveryPersonId: deliveryPersonId
          })
          setServerUserRole(response.userRole)
        } else {
          console.warn('Server did not return user role for order:', orderId)
        }
      } catch (error: unknown) {
        console.error('Error loading messages:', error)
        // Handle authentication errors gracefully
        if (error instanceof Error && error.message && error.message.includes('Not authenticated')) {
          showNotification(t('chat.auth_required') || 'Please log in to view messages', 'warning')
          onClose()
        } else {
          showNotification(t('chat.loading_error') || 'Failed to load messages', 'error')
        }
      } finally {
        setLoading(false)
      }
    }

    loadMessages()

    // Subscribe to real-time updates
    if (process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID && process.env.NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID) {
      try {
        const unsubscribeFn = client.subscribe(
          `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID}.documents`,
          (response: { payload: unknown; events: string[] }) => {
            try {
              const payload = response.payload as Record<string, unknown>
              // Check if this message belongs to the current order
              if (payload.orderId === orderId) {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                  // Normalize the message: map $createdAt to createdAt for frontend compatibility
                  // Convert through unknown first to satisfy TypeScript
                  const messageData = payload as unknown as ChatMessage
                  const normalizedMessage: ChatMessage = {
                    ...messageData,
                    createdAt: messageData.createdAt || (payload.$createdAt as string) || undefined,
                  }
                  
                  // Add new message to state, avoiding duplicates
                  setMessages((prev) => {
                    // Check if message already exists (avoid duplicates)
                    const exists = prev.some((msg) => msg.$id === normalizedMessage.$id)
                    if (exists) {
                      return prev
                    }
                    // Add new message and sort by createdAt
                    const updated = [...prev, normalizedMessage]
                    return updated.sort((a, b) => {
                      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                      return timeA - timeB
                    })
                  })
                }
              }
            } catch (subscribeError) {
              console.error('Error processing real-time chat update:', subscribeError)
            }
          }
        )
        setUnsubscribe(() => unsubscribeFn)
      } catch (subscribeError) {
        console.error('Error setting up real-time subscription:', subscribeError)
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orderId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      setSending(true)
      // Determine role dynamically when sending message
      // Prefer server-determined role, fall back to client-side determination
      const currentUserRole = getUserRole()
      
      // Log the role determination for debugging
      console.log('Sending message - Role determination:', {
        orderId,
        userId: user.$id,
        serverUserRole,
        determinedRole: currentUserRole,
        customerId,
        deliveryPersonId
      })
      
      // If we don't have a server role yet, wait a bit for it to load, or use client determination
      if (!serverUserRole) {
        console.warn('Sending message without server-determined role. Using client-side determination.')
      }
      
      await sendChatMessage(orderId, newMessage.trim(), user.$id, userName, currentUserRole)
      setNewMessage('')
    } catch (error: unknown) {
      console.error('Error sending message:', error)
      // Handle authentication errors gracefully
      if (error instanceof Error) {
        if (error.message && error.message.includes('Not authenticated')) {
          showNotification(t('chat.auth_required') || 'Please log in to send messages', 'warning')
          onClose()
        } else if (error.message && error.message.includes('Invalid sender role')) {
          // Show more detailed error for role mismatch
          const chatError = error as ChatError
          const errorMessage = chatError.details 
            ? `${error.message}: ${chatError.details}` 
            : error.message
          showNotification(errorMessage, 'error')
        } else {
          showNotification(error.message || t('chat.send_error') || 'Failed to send message', 'error')
        }
      } else {
        showNotification(t('chat.send_error') || 'Failed to send message', 'error')
      }
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null
  
  // Don't render if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{t('chat.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
            aria-label={t('policy.close')}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">{t('chat.loading')}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">{t('chat.no_messages')}</div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === user?.$id
              return (
                <div
                  key={message.$id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {message.senderName} ({message.senderRole === 'customer' ? t('chat.customer_label') : t('chat.delivery_label')})
                    </div>
                    <div className="text-sm">{message.message}</div>
                    {message.createdAt && (
                      <div className="text-xs mt-1 opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? '...' : t('chat.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

