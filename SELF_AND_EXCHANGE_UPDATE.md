# Self Ordering and Exchange System Update

## Summary
Complete implementation of the new Self (cafeteria) ordering system and Exchange marketplace enhancements with day-aware meal selection, gender-based ordering, location selection, and comprehensive business rules.

---

## 1. Self Menu Component (`/src/components/SelfMenu.tsx`)

### New Features Implemented

#### Type Definitions
```typescript
type GenderType = 'male' | 'female'
type MealType = 'lunch' | 'dinner'
type LunchLocationType = 'kaleh_central' | 'kaleh_north' | 'self_hall' | 'kaleh_hall'
type DinnerDormType = 'ahmadi' | 'tarasht2' | 'tarasht3'
```

#### Business Logic

1. **Gender Selection**
   - Male/Female options at the start of ordering flow
   - Required for all Self orders

2. **Day-Aware Meal Selection**
   - Friday: All ordering disabled
   - Thursday: Lunch uses dinner rules (dorm delivery only)
   - Saturday-Wednesday: Standard lunch/dinner rules apply

3. **Location Selection Logic**

   **For Lunch (Sat-Wed):**
   - 4 Location Options:
     - کاله بیرون‌بر پردیس (Kaleh Central)
     - کاله بیرون‌بر شمالی (Kaleh North)
     - سلف سالن سلف (Self Hall)
     - سالن کاله (Kaleh Hall)
   - Packaging Fee: 7,000 Toman for hall dining (Self Hall, Kaleh Hall)

   **For Dinner (All days) and Thursday Lunch:**
   - 3 Dorm Options:
     - خوابگاه احمدی روشن (Ahmadi)
     - خوابگاه طرشت ۲ (Tarasht 2)
     - خوابگاه طرشت ۳ (Tarasht 3)
   - Base Price: 15,000 Toman for dorm delivery
   - Alternative: University delivery fee + 10,000 Toman

4. **Packaging Fee Calculation**
   - 7,000 Toman added automatically for hall dining locations
   - Only applies to lunch orders (Sat-Wed)
   - Not applicable to dorm meals

---

## 2. Shopping Cart Updates (`/src/app/customer/shopping-cart/page.tsx`)

### New Interface Fields
```typescript
interface OrderData {
  // ... existing fields
  selfMealType?: 'lunch' | 'dinner'
  selfGender?: 'male' | 'female'
  selfLocation?: string
  selfIsDormMeal?: boolean
  selfPackagingFee?: number
  selfIsThursdayLunch?: boolean
}
```

### Pricing Logic

1. **Packaging Fee Display**
   - Shows "هزینه پک غذا" line item when applicable
   - Automatically added to subtotal

2. **Dorm Meal Pricing**
   - Detects if order is for dorm delivery (dinner or Thursday lunch)
   - **Dorm Delivery:** Base price 15,000 Toman
   - **University Delivery:** Delivery fee + 10,000 Toman
   - Displays pricing explanation in blue info box

3. **Delivery Location Filtering**
   - For dorm meals: Shows only user's dorm + all university locations
   - Filters out other dorm cafeterias
   - Adds helpful notice about dorm meal delivery options

### UI Enhancements

- Food name and code input fields (already present)
- Packaging fee line item in order summary
- Dorm meal pricing explanation box
- Filtered delivery location dropdown

---

## 3. Exchange System Updates (`/src/components/ExchangeContent.tsx`)

### New Features

#### New State Variables
```typescript
const [newMealType, setNewMealType] = useState<'lunch' | 'dinner'>('lunch')
const [newLocation, setNewLocation] = useState('')
```

#### New Form Fields

1. **Meal Type Dropdown (نوع وعده)**
   - Options: ناهار (Lunch), شام (Dinner)
   - Required field

2. **Location Dropdown (مکان)**
   - 8 Options:
     - طرشت ۲ (Tarasht 2)
     - طرشت ۳ (Tarasht 3)
     - احمدی روشن (Ahmadi Roshan)
     - سلف دانشگاه پسران (University Boys Cafeteria)
     - سلف دانشگاه دختران (University Girls Cafeteria)
     - کاله بیرون‌بر پردیس (Kaleh Central)
     - کاله بیرون‌بر شمالی (Kaleh North)
     - سالن کاله (Kaleh Hall)
   - Required field

#### Updated Interface
```typescript
interface ExchangeListing {
  // ... existing fields
  mealType?: 'lunch' | 'dinner'
  location?: string
}
```

#### Form Submission
- Now includes `mealType` and `location` in listing creation
- Validates location is selected before submission
- Resets new fields after successful submission

---

## 4. Key Business Rules Summary

### Self Ordering Rules

| Day | Meal | Available Locations | Packaging Fee | Special Notes |
|-----|------|-------------------|---------------|---------------|
| Sat-Wed | Lunch | 4 locations (Kaleh x2, Self Hall, Kaleh Hall) | 7,000 for halls | Standard lunch |
| Sat-Wed | Dinner | 3 dorms (Ahmadi, Tarasht 2/3) | None | Dorm delivery |
| Thursday | Lunch | 3 dorms (follows dinner rules) | None | Special case |
| Thursday | Dinner | 3 dorms | None | Standard dinner |
| Friday | All | DISABLED | N/A | No ordering |

### Pricing Rules

1. **Hall Dining (Sat-Wed Lunch)**
   - Base price + 7,000 packaging + delivery fee

2. **Dorm Meals (Dinner & Thu Lunch)**
   - Option A: Deliver to dorm = 15,000 Toman
   - Option B: Deliver to university = delivery fee + 10,000 Toman

3. **Exchange Listings**
   - Maximum price: 60,000 Toman (existing rule)
   - Must specify meal type and location

---

## 5. Testing Checklist

### Self Menu Testing
- [ ] Gender selection works for both male/female
- [ ] Friday disables all ordering
- [ ] Thursday lunch shows dorm options (not lunch locations)
- [ ] Saturday-Wednesday lunch shows 4 locations
- [ ] Dinner always shows 3 dorms
- [ ] Packaging fee calculated correctly for hall dining
- [ ] Cart receives all new fields (gender, meal type, location, etc.)

### Shopping Cart Testing
- [ ] Food name and code inputs appear for Self orders
- [ ] Packaging fee displays in order summary
- [ ] Dorm meal pricing explanation shows correctly
- [ ] Delivery locations filter properly for dorm meals
- [ ] Final price calculates correctly for all scenarios:
  - [ ] Regular lunch with hall packaging
  - [ ] Dorm meal delivered to dorm (15,000)
  - [ ] Dorm meal delivered to university (fee + 10,000)

### Exchange System Testing
- [ ] Meal type dropdown appears in create listing form
- [ ] Location dropdown shows all 8 options
- [ ] Form validation requires both new fields
- [ ] Listings are created with meal type and location
- [ ] Existing listings without new fields still display

---

## 6. Files Modified

1. `/src/components/SelfMenu.tsx` - Complete rewrite (669 lines)
2. `/src/app/customer/shopping-cart/page.tsx` - Updated pricing and UI
3. `/src/components/ExchangeContent.tsx` - Added meal type and location fields

---

## 7. Technical Notes

- All changes are type-safe with TypeScript
- Build completes successfully with no errors
- Backward compatible with existing orders
- Persian language support throughout
- Responsive UI on all screen sizes

---

## 8. Next Steps

1. **Backend Updates** (if needed)
   - Update API to accept new Exchange listing fields
   - Ensure database schema supports `mealType` and `location` fields
   - Update order creation API to handle new Self order fields

2. **Testing**
   - End-to-end testing of Self ordering flow
   - Exchange listing creation with new fields
   - Order submission with various pricing scenarios

3. **Deployment**
   - Test on staging environment
   - Verify Appwrite collections have required fields
   - Deploy to production

---

*Document created: December 2024*
*Build Status: ✓ Successful*
