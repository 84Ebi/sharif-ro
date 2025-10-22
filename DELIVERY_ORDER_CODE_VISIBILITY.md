# Delivery Order Code Visibility Fix

## Overview
Fixed the delivery system to properly handle order code visibility for Self service orders vs regular restaurant orders.

## Problem
- Order codes were being displayed for all orders in the delivery interface
- Self service orders should not show order codes until after delivery person accepts the order
- This was confusing for delivery persons as they couldn't distinguish between order types

## Solution Implemented

### 1. Delivery Dashboard (`/delivery/page.tsx`)
**Changes Made:**
- **Order Header Display**: Changed order identification to show "سلف سرویس" (Self Service) instead of order code for Self orders
- **Order Details**: Added conditional display for order codes:
  - Self orders: Show warning message that order code will be available after acceptance
  - Regular orders: Show order code if available

**Key Code Changes:**
```tsx
// Header display
{order.restaurantLocation === 'Self' ? 'سلف سرویس' : (order.orderCode || order.$id?.slice(0, 8))}

// Details section
{order.restaurantLocation === 'Self' ? (
  <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
    <div className="text-sm text-yellow-800">
      <strong>⚠️ Self Service Order</strong><br/>
      <span className="text-xs">Order code will be shown after acceptance</span>
    </div>
  </div>
) : (
  order.orderCode && <div><strong>Order Code:</strong> {order.orderCode}</div>
)}
```

### 2. My Deliveries (`/delivery/orders/page.tsx`)
**Changes Made:**
- **Order Header Display**: Show "سلف سرویس" for Self orders instead of order code
- **Order Code Section**: Always show order code section for Self orders (even if empty) to maintain UI consistency
- **Conditional Logic**: Different display logic for Self vs regular orders

**Key Code Changes:**
```tsx
// Header display
{order.restaurantLocation === 'Self' ? 'سلف سرویس' : (order.orderCode || order.$id?.slice(0, 8))}

// Order code section
{order.restaurantLocation === 'Self' ? (
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase">Order Code</p>
    <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
      {order.orderCode || 'Not available'}
    </p>
  </div>
) : (
  order.orderCode && (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase">Order Code</p>
      <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
        {order.orderCode}
      </p>
    </div>
  )
)}
```

## User Experience Improvements

### For Delivery Persons:
1. **Clear Order Type Identification**: 
   - Self orders clearly labeled as "سلف سرویس"
   - Regular orders show order code or ID

2. **Better Information Flow**:
   - Self orders show warning that order code will be available after acceptance
   - Regular orders show order code immediately if available

3. **Consistent UI**:
   - Order code section always present for Self orders
   - Maintains visual consistency across different order types

### For Self Service Orders:
1. **Privacy Protection**: Order codes not visible until delivery person accepts
2. **Clear Communication**: Warning message explains when order code will be available
3. **Proper Workflow**: Order code becomes available after acceptance in "My Deliveries"

## Technical Implementation

### Conditional Rendering Logic:
- Uses `order.restaurantLocation === 'Self'` to identify Self service orders
- Different display components for Self vs regular orders
- Maintains backward compatibility with existing order structure

### UI Components:
- **Warning Box**: Yellow background with warning icon for Self orders
- **Persian Text**: "سلف سرویس" for Self service identification
- **Consistent Styling**: Maintains existing design patterns

## Files Modified:
1. `/src/app/delivery/page.tsx` - Delivery dashboard
2. `/src/app/delivery/orders/page.tsx` - My deliveries page

## Testing Scenarios:
1. **Self Service Orders**: Should show "سلف سرویس" and warning message
2. **Regular Orders**: Should show order code or ID as before
3. **Accepted Orders**: Order codes should be visible in "My Deliveries"
4. **Mixed Order Lists**: Both types should display correctly in same list

## Benefits:
- ✅ Clear distinction between order types
- ✅ Better user experience for delivery persons
- ✅ Privacy protection for Self service orders
- ✅ Consistent UI across delivery interface
- ✅ Maintains existing functionality for regular orders

## Future Considerations:
- Could add order type icons for even clearer visual distinction
- Consider adding order type filter in delivery dashboard
- May want to add order type statistics for delivery persons
