# Customer Information Visibility Update

## Overview
Customer information (name and phone) is now only shown AFTER the delivery person accepts an order, protecting customer privacy until the order is confirmed.

## Changes Made

### 1. Delivery Dashboard (`/delivery/page.tsx`)
**BEFORE Acceptance - Pending Orders**
- ❌ Customer information is **HIDDEN**
- Shows only:
  - Order code/ID
  - Restaurant → Delivery location
  - Order notes
  - Price
  - "Accept Order" button

### 2. My Deliveries (`/delivery/orders/page.tsx`)
**AFTER Acceptance - Accepted Orders**
- ✅ Customer information is **VISIBLE**
- Shows in collapsed view:
  - 👤 Customer Name (highlighted in blue box)
  - 📱 Customer Phone (highlighted in blue box)
  
- Shows in expanded view:
  - Full customer details (name, phone, email)
  - All order details
  - Timeline
  - "Mark as Delivered" button

## Privacy Protection

This implementation ensures:
1. **Customer privacy** - Contact info not visible to all delivery persons
2. **Commitment** - Only the delivery person who accepts sees customer info
3. **Security** - Prevents unauthorized contact before order acceptance

## User Flow

```
Delivery Person Views Pending Orders
         ↓
    [No customer info shown]
         ↓
   Accepts an Order
         ↓
Order moves to "My Deliveries"
         ↓
  [Customer info now visible]
         ↓
Can contact customer for delivery
```

## Files Modified

- `/src/app/delivery/page.tsx` - Removed customer info from pending orders
- `/src/app/delivery/orders/page.tsx` - Customer info visible in accepted orders (already implemented)

## Testing

1. Navigate to Delivery Dashboard
2. Expand a pending order
3. Verify customer info is NOT shown
4. Accept an order
5. Navigate to "My Deliveries"
6. Verify customer info IS shown prominently

## Benefits

- ✅ Privacy-first approach
- ✅ Professional delivery workflow
- ✅ Clear visual distinction between pending and accepted orders
- ✅ Easy access to customer contact after acceptance

