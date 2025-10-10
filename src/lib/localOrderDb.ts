import { databases, ID, Query } from './appwrite';
import type { Models } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;

export interface Order extends Models.Document {
  restaurantLocation: string;
  restaurantType: string;
  orderCode?: string;
  deliveryLocation: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  extraNotes?: string;
  price: number;
  status: 'pending' | 'confirmed' | 'delivered';
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

export interface OrderFilters {
  status?: string;
  userId?: string;
  deliveryPersonId?: string;
  restaurantLocation?: string;
  minPrice?: number;
  maxPrice?: number;
}

type OrderUpdateData = {
  status: 'pending' | 'confirmed' | 'delivered';
  deliveredAt?: string;
};

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, '$id' | '$createdAt' | '$updatedAt'>): Promise<Order> {
  try {
    const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), orderData);
    return response as unknown as Order;
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
    const queries: string[] = [];
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    if (filters?.userId) {
      queries.push(Query.equal('userId', filters.userId));
    }
    
    if (filters?.deliveryPersonId) {
      queries.push(Query.equal('deliveryPersonId', filters.deliveryPersonId));
    }
    
    if (filters?.restaurantLocation) {
      queries.push(Query.search('restaurantLocation', filters.restaurantLocation));
    }
    
    if (filters?.minPrice !== undefined) {
      queries.push(Query.greaterThanEqual('price', filters.minPrice));
    }
    
    if (filters?.maxPrice !== undefined) {
      queries.push(Query.lessThanEqual('price', filters.maxPrice));
    }
    
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    const orders = response.documents as unknown as Order[];
    
    // Sort by creation date, newest first
    orders.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
    
    return orders;
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
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, orderId);
    return response as unknown as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

/**
 * Confirm order for delivery
 */
export async function confirmOrder(
  orderId: string,
  deliveryPersonData: { id: string; name: string; phone: string }
): Promise<Order | null> {
  try {
    const updateData = {
      status: 'confirmed',
      deliveryPersonId: deliveryPersonData.id,
      deliveryPersonName: deliveryPersonData.name,
      deliveryPersonPhone: deliveryPersonData.phone,
      confirmedAt: new Date().toISOString(),
    };
    
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, orderId, updateData);
    return response as unknown as Order;
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
): Promise<Order | null> {
  try {
    const updateData: OrderUpdateData = { 
      status,
    };
    
    // Add timestamp for delivered status
    if (status === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();
    }
    
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, orderId, updateData);
    return response as unknown as Order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Update order
 */
export async function updateOrder(orderId: string, data: Partial<Order>): Promise<Order | null> {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, orderId, data);
    return response as unknown as Order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, orderId);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}
