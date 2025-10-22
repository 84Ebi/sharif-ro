# Self Order Page Update

## Summary
Updated the order page (`/order`) to provide a specialized form for "Self" (سلف سرویس) orders with Persian UI and enhanced features.

## Changes Made

### 1. Conditional UI Based on Restaurant Type
The order form now detects when the restaurant parameter is "Self" and displays a different form:
- **Regular orders**: Standard English form
- **Self orders**: Persian form with specialized fields

### 2. Features for Self Orders

#### ✅ Required Fields
- **کد سفارش (Order Code)**: Now required for Self orders
- **نام غذا (Food Name)**: New input field for the name of the food items
- **Restaurant Location**: Automatically set to "Self" (hidden from user)

#### ✅ Removed Fields
- **Restaurant Type input**: Removed for Self orders
- **Restaurant Location input**: Hidden (automatically set to "Self")

#### ✅ Delivery Address Dropdown
Implemented the same delivery location dropdown as in SharifPlus and SharifFastFood:
- Dropdown with predefined locations (دانشکده‌ها، خوابگاه‌ها، etc.)
- Better UX with clickable selection
- Prevents typos and ensures consistent location names

#### ✅ Additional Options

**Checkboxes:**
- ☐ ظرف (Container)
- ☐ قاشق چنگال (Utensils)

**Drinks & Add-ons Dropdown:**
- نوشابه کوکا (20,000 تومان)
- نوشابه زیرو (20,000 تومان)
- اسپرایت (20,000 تومان)
- دوغ (15,000 تومان)
- ماست (15,000 تومان)
- لیموناد (25,000 تومان)

#### ✅ Automatic Price Calculation
- When a drink is selected, the final price is calculated automatically
- Displays "مبلغ نهایی با نوشیدنی" with the total amount

### 3. Data Structure

#### Self Order Submission Format:
```javascript
{
  restaurantLocation: "Self",
  restaurantType: form.orderName,  // Food name
  orderCode: `${orderCode}
  
  موارد اضافی:
  - ظرف (if selected)
  - قاشق چنگال (if selected)
  - نوشیدنی: ${selectedDrink} (if selected)`,
  deliveryLocation: selectedLocation,
  phone: phoneNumber,
  price: basePrice + drinkPrice,
  status: "pending"
}
```

### 4. UI/UX Improvements

#### Persian Interface for Self Orders:
- All labels in Persian
- Right-to-left (RTL) text alignment
- Persian number formatting (with toLocaleString())
- Success message in Persian

#### Visual Feedback:
- Blue highlight for selected delivery location dropdown
- Price summary shows drink addition
- Clear section for additional items (موارد اضافی)

## Usage

### For Users:
1. Click "Self" button on customer page
2. Redirected to `/order?restaurant=Self`
3. Fill out Persian form:
   - کد سفارش (required)
   - نام غذا (required)
   - Select delivery location from dropdown
   - Phone number
   - Price
   - Optional: Select drink
   - Optional: Check ظرف or قاشق چنگال
   - Optional: Add extra notes
4. Submit order
5. Redirected to customer page with success message

### For Other Restaurants:
- Standard English form remains unchanged
- All original functionality preserved

## Files Modified

- `/src/app/order/page.tsx`: Complete refactor with conditional rendering

## New Constants Added

```javascript
const deliveryLocations = [
  'دانشکده فیزیک',
  'دانشکده علوم ریاضی',
  // ... 27 locations total
]

const drinksAndAddons = [
  { name: 'نوشابه کوکا', price: 20000 },
  { name: 'نوشابه زیرو', price: 20000 },
  { name: 'اسپرایت', price: 20000 },
  { name: 'دوغ', price: 15000 },
  { name: 'ماست', price: 15000 },
  { name: 'لیموناد', price: 25000 },
]
```

## Testing Checklist

- [ ] Click "Self" button on customer page
- [ ] Verify Persian UI appears
- [ ] Test order code input (required)
- [ ] Test food name input (required)
- [ ] Test delivery location dropdown
- [ ] Select different drinks and verify price calculation
- [ ] Toggle checkboxes (ظرف, قاشق چنگال)
- [ ] Submit order and verify data
- [ ] Check that regular order form still works for other restaurants

## Screenshots Expected

### Self Order Form:
- Header: "ثبت سفارش سلف سرویس"
- Required fields with Persian labels
- Dropdown for delivery location
- Drinks dropdown with prices
- Checkboxes for additional items
- Price summary
- Submit button: "ثبت سفارش"

## Notes

- All validation remains in place
- Required fields must be filled
- Phone number validation
- Price must be greater than 0
- Success alert in Persian for Self orders
- Error handling preserved

## Future Enhancements

Possible improvements:
- Add images for drinks
- Quantity selector for drinks
- Save favorite delivery location
- Auto-fill phone from user profile
- Order history specific to Self service

---

**Date**: October 22, 2025
**Status**: ✅ Complete and Ready for Testing

