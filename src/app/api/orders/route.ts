import * as orderDb from '@/lib/localOrderDb';

// GET /api/orders - Get all orders with optional filters
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const filters: Record<string, string | number> = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!;
    }
    if (searchParams.get('userId')) {
      filters.userId = searchParams.get('userId')!;
    }
    if (searchParams.get('deliveryPersonId')) {
      filters.deliveryPersonId = searchParams.get('deliveryPersonId')!;
    }
    if (searchParams.get('restaurantLocation')) {
      filters.restaurantLocation = searchParams.get('restaurantLocation')!;
    }
    if (searchParams.get('minPrice')) {
      filters.minPrice = parseFloat(searchParams.get('minPrice')!);
    }
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    }
    
    const orders = await orderDb.getOrders(filters);
    
    return Response.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'restaurantLocation',
      'restaurantType',
      'deliveryLocation',
      'userId',
      'fullName',
      'phone',
      'price',
      'status'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const order = await orderDb.createOrder(body);
    
    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: `Failed to create order: ${errorMessage}` },
      { status: 500 }
    );
  }
}
