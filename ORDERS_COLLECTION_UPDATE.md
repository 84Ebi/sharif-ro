# Orders Collection Update Required

## Issue
The `deliveryPersonCardNumber` attribute needs to be added to the `orders` collection in Appwrite.

## Error
```
Failed to update order: Invalid document structure: Unknown attribute: "deliveryPersonCardNumber"
```

## Solution

### Step 1: Add Attribute to Orders Collection

1. Go to Appwrite Console → Database → Your Database → Collections → `orders`
2. Click on "Attributes" tab
3. Click "Create Attribute"
4. Configure the attribute:
   - **Key**: `deliveryPersonCardNumber`
   - **Type**: String
   - **Size**: 50 (or appropriate size for card numbers)
   - **Required**: No (optional)
   - **Array**: No
   - **Default**: None
5. Click "Create"

### Step 2: Verify

After adding the attribute, the order confirmation should work without errors.

## Alternative: Make Attribute Optional in Code

If you want to make the feature optional (works without the attribute), the code already handles this gracefully - it will just skip saving the card number if the attribute doesn't exist. However, for full functionality, you should add the attribute as described above.


