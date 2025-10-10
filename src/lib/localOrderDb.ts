import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'orders.json');

export interface Order {
  $id: string;
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
  $createdAt: string;
  $updatedAt: string;
}

export interface OrderFilters {
  status?: string;
  userId?: string;
  deliveryPersonId?: string;
  restaurantLocation?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface Database {
  orders: Order[];
}

// Initialize database file
async function initDatabase(): Promise<void> {
  try {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      await fs.access(DB_PATH);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(DB_PATH, JSON.stringify({ orders: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Read database
async function readDatabase(): Promise<Database> {
  try {
    await initDatabase();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { orders: [] };
  }
}

// Write database
async function writeDatabase(db: Database): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, '$id' | '$createdAt' | '$updatedAt'>): Promise<Order> {
  try {
    const db = await readDatabase();
    
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      $id: uuidv4(),
      $createdAt: now,
      $updatedAt: now,
    };
    
    db.orders.push(newOrder);
    await writeDatabase(db);
    
    return newOrder;
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
    const db = await readDatabase();
    let orders = [...db.orders];
    
    // Apply filters
    if (filters?.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    
    if (filters?.userId) {
      orders = orders.filter(order => order.userId === filters.userId);
    }
    
    if (filters?.deliveryPersonId) {
      orders = orders.filter(order => order.deliveryPersonId === filters.deliveryPersonId);
    }
    
    if (filters?.restaurantLocation) {
      orders = orders.filter(order => 
        order.restaurantLocation.toLowerCase().includes(filters.restaurantLocation!.toLowerCase())
      );
    }
    
    if (filters?.minPrice !== undefined) {
      orders = orders.filter(order => order.price >= filters.minPrice!);
    }
    
    if (filters?.maxPrice !== undefined) {
      orders = orders.filter(order => order.price <= filters.maxPrice!);
    }
    
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
    const db = await readDatabase();
    const order = db.orders.find(o => o.$id === orderId);
    return order || null;
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
): Promise<Order | null> {
  try {
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(o => o.$id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      status: 'confirmed',
      deliveryPersonId: deliveryPersonData.id,
      deliveryPersonName: deliveryPersonData.name,
      deliveryPersonPhone: deliveryPersonData.phone,
      confirmedAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
    
    await writeDatabase(db);
    return db.orders[orderIndex];
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
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(o => o.$id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    const updateData: Partial<Order> = { 
      status,
      $updatedAt: new Date().toISOString()
    };
    
    // Add timestamp for delivered status
    if (status === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();
    }
    
    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      ...updateData,
    };
    
    await writeDatabase(db);
    return db.orders[orderIndex];
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
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(o => o.$id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    db.orders[orderIndex] = {
      ...db.orders[orderIndex],
      ...data,
      $updatedAt: new Date().toISOString(),
    };
    
    await writeDatabase(db);
    return db.orders[orderIndex];
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
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(o => o.$id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }
    
    db.orders.splice(orderIndex, 1);
    await writeDatabase(db);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}
