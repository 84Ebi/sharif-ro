import * as orderDb from '@/lib/localOrderDb';

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderDb.getOrder(id);
    
    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update an order
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Handle special update operations
    if (body.action === 'confirm' && body.deliveryPersonData) {
      const order = await orderDb.confirmOrder(id, body.deliveryPersonData);
      
      if (!order) {
        return Response.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return Response.json({ order }, { status: 200 });
    }
    
    if (body.action === 'updateStatus' && body.status) {
      const order = await orderDb.updateOrderStatus(id, body.status);
      
      if (!order) {
        return Response.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return Response.json({ order }, { status: 200 });
    }
    
    // General update
    const order = await orderDb.updateOrder(id, body);
    
    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return Response.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: `Failed to update order: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await orderDb.deleteOrder(id);
    
    if (!success) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return Response.json(
      { message: 'Order deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return Response.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
