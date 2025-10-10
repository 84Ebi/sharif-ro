// Client-side wrapper for order operations via API routes

export interface Order {
  $id?: string
  restaurantLocation: string
  restaurantType: string
  orderCode?: string
  deliveryLocation: string
  userId: string
  fullName: string
  phone: string
  email?: string
  extraNotes?: string
  price: number
  status: 'pending' | 'confirmed' | 'delivered'
  deliveryPersonId?: string
  deliveryPersonName?: string
  deliveryPersonPhone?: string
  confirmedAt?: string
  deliveredAt?: string
  $createdAt?: string
  $updatedAt?: string
}

export interface OrderFilters {
  status?: string
  userId?: string
  deliveryPersonId?: string
  restaurantLocation?: string
  minPrice?: number
  maxPrice?: number
}

import client from './appwrite';

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, '$id' | '$createdAt' | '$updatedAt'>): Promise<Order> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get orders with optional filters
 */
export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.deliveryPersonId) params.append('deliveryPersonId', filters.deliveryPersonId);
    if (filters?.restaurantLocation) params.append('restaurantLocation', filters.restaurantLocation);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    
    const response = await fetch(`/api/orders?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }
    
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

/**
 * Get orders for a specific user
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return getOrders({ userId });
}

/**
 * Get pending orders (for delivery dashboard)
 */
export async function getPendingOrders(filters?: Omit<OrderFilters, 'status'>): Promise<Order[]> {
  return getOrders({ ...filters, status: 'pending' });
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Confirm order for delivery
 */
export async function confirmOrder(
  orderId: string,
  deliveryPersonData: { id: string; name: string; phone: string }
): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'confirm',
        deliveryPersonData,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to confirm order');
    }
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'delivered'
): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateStatus',
        status,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order status');
    }
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Update order
 */
export async function updateOrder(orderId: string, data: Partial<Order>): Promise<Order> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order');
    }
    
    const responseData = await response.json();
    return responseData.order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete order');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates on orders
 */
export function subscribeToOrders(callback: (payload: Order) => void): () => void {
    if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || !process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID) {
        throw new Error("Database or collection ID not configured for real-time updates.");
    }
    const unsubscribe = client.subscribe(`databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID}.documents`, response => {
        callback(response.payload as Order);
    });

    return unsubscribe;
}
