# Sharif-Ro Order Management System

A Next.js-based order management system with real-time updates using Appwrite as the backend.

## 📋 Features

- **Customer Order Submission**: Users can place orders with restaurant and delivery details
- **Delivery Dashboard**: Delivery personnel can view and accept orders
- **Real-time Updates**: Orders update in real-time using Appwrite subscriptions
- **Order Status Tracking**: Track orders from pending → confirmed → delivered
- **Contact Information Exchange**: Delivery person and customer details are shared upon order confirmation
- **Authentication**: Secure user authentication with Appwrite
- **Role-based Access**: Different interfaces for customers and delivery personnel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- An Appwrite instance (Cloud or Self-hosted)
- Git

### 1. Clone and Install

```bash
cd sharifro
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `sharifro` directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
```

---

## 🗄️ Appwrite Database Setup

### Step 1: Create an Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted Appwrite instance
2. Click **"Create Project"**
3. Enter project name: `SharifRo`
4. Copy the **Project ID** and paste it in your `.env.local` as `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

### Step 2: Set Up Authentication

1. In your Appwrite project, go to **Auth** in the left sidebar
2. Click on **Settings**
3. Configure the following:
   - **User Sessions**: Set session length as needed (e.g., 365 days)
   - **Auth Methods**: Enable **Email/Password**
   - **Email Verification**: Enable this for delivery personnel verification

### Step 3: Create Database

1. Navigate to **Databases** in the left sidebar
2. Click **"Create Database"**
3. Database name: `orders_db`
4. Copy the **Database ID** and paste it in your `.env.local` as `NEXT_PUBLIC_APPWRITE_DATABASE_ID`

### Step 4: Create Orders Collection

1. Inside the `orders_db` database, click **"Create Collection"**
2. Collection name: `orders`
3. Collection ID: Use auto-generated or custom (e.g., `orders`)
4. Copy the **Collection ID** and paste it in your `.env.local` as `NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID`

### Step 5: Configure Collection Attributes

Click on the **Attributes** tab in your `orders` collection and create the following attributes:

| Attribute Name       | Type     | Size  | Required | Default   | Array |
|---------------------|----------|-------|----------|-----------|-------|
| `restaurantLocation`| String   | 255   | Yes      | -         | No    |
| `restaurantType`    | String   | 100   | Yes      | -         | No    |
| `orderCode`         | String   | 50    | No       | -         | No    |
| `deliveryLocation`  | String   | 500   | Yes      | -         | No    |
| `userId`            | String   | 100   | Yes      | -         | No    |
| `fullName`          | String   | 100   | Yes      | -         | No    |
| `phone`             | String   | 20    | Yes      | -         | No    |
| `email`             | String   | 100   | No       | -         | No    |
| `extraNotes`        | String   | 1000  | No       | -         | No    |
| `price`             | Float    | -     | Yes      | -         | No    |
| `status`            | String   | 20    | Yes      | pending   | No    |
| `deliveryPersonId`  | String   | 100   | No       | -         | No    |
| `deliveryPersonName`| String   | 100   | No       | -         | No    |
| `deliveryPersonPhone`| String  | 20    | No       | -         | No    |
| `confirmedAt`       | DateTime | -     | No       | -         | No    |
| `deliveredAt`       | DateTime | -     | No       | -         | No    |

**To add each attribute:**
1. Click **"Create Attribute"**
2. Select the attribute type (String, Float, or DateTime)
3. Enter the attribute name
4. Set size (for strings)
5. Check "Required" if needed
6. Set default value if applicable
7. Click **"Create"**

### Step 6: Configure Collection Permissions

1. Go to the **Settings** tab in your `orders` collection
2. Click on **Permissions**
3. Add the following permissions:

**For Create (customers can create orders):**
- Role: `Users`
- Permission: `Create`

**For Read (anyone authenticated can read):**
- Role: `Users`
- Permission: `Read`

**For Update (users can update their own orders):**
- Role: `Users`
- Permission: `Update`

**For Delete (optional - only if you want users to cancel orders):**
- Role: `Users`
- Permission: `Delete`

### Step 7: Create Indexes (for better performance)

1. Go to the **Indexes** tab
2. Create the following indexes:

**Index 1: Status Index**
- Key: `status_idx`
- Type: Key
- Attributes: `status` (ASC)

**Index 2: User Index**
- Key: `userId_idx`
- Type: Key
- Attributes: `userId` (ASC)

**Index 3: Delivery Person Index**
- Key: `deliveryPersonId_idx`
- Type: Key
- Attributes: `deliveryPersonId` (ASC)

**Index 4: Created At Index** (for sorting)
- Key: `createdAt_idx`
- Type: Key
- Attributes: `$createdAt` (DESC)

### Step 8: Enable Real-time

1. In your collection **Settings**, ensure **Real-time** is enabled
2. This allows automatic updates when orders change

---

## 📁 Project Structure

```
sharifro/
├── src/
│   ├── app/
│   │   ├── order/          # Customer order page
│   │   │   └── page.tsx
│   │   ├── delivery/       # Delivery dashboard
│   │   │   └── page.tsx
│   │   ├── customer/       # Customer order status page
│   │   │   └── page.tsx
│   │   └── auth/           # Authentication pages
│   │       └── page.tsx
│   ├── lib/
│   │   ├── appwrite.ts     # Appwrite configuration
│   │   ├── useAuth.ts      # Authentication hook
│   │   └── orders.ts       # Order management functions
│   └── components/
│       └── BottomDock.tsx  # Navigation component
├── .env.local              # Environment variables
└── package.json
```

---

## 💻 Usage

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Customer Flow

1. Navigate to `/auth` to sign up or log in
2. Go to `/order` to submit a new order
3. Fill in:
   - Restaurant location
   - Restaurant type (e.g., "Fast Food", "Pizza", "Cafe")
   - Order code (optional)
   - Delivery location
   - Extra notes (optional)
   - Price
4. Submit the order
5. Go to `/customer` to view your orders and track status

### Delivery Flow

1. Navigate to `/auth` to sign up or log in as a delivery person
2. Go to `/delivery` to view available orders
3. Filter orders by:
   - Restaurant location
   - Price range
   - Status
4. Click on an order to expand details
5. Click **"Confirm Delivery"** to accept the order
6. Customer details will be shown after confirmation

---

## 🔧 API Functions

The system includes these main functions (in `src/lib/orders.ts`):

- `createOrder(orderData)` - Create a new order
- `getOrders(filters)` - Fetch orders with filters
- `getOrdersByUser(userId)` - Get orders for a specific user
- `confirmOrder(orderId, deliveryPersonData)` - Confirm order for delivery
- `updateOrderStatus(orderId, status)` - Update order status
- `subscribeToOrders(callback)` - Real-time order updates

---

## 🔐 Security Notes

- All database operations require authentication
- Users can only update their own orders
- Delivery person information is only shared after order confirmation
- Email verification can be required for delivery personnel

---

## 🐛 Troubleshooting

**Issue: "Invalid permissions" error**
- Check collection permissions in Appwrite console
- Ensure user is authenticated

**Issue: Real-time updates not working**
- Verify real-time is enabled in collection settings
- Check browser console for WebSocket errors

**Issue: Orders not showing**
- Verify database and collection IDs in `.env.local`
- Check Appwrite console for data

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID | `67abc123def456` |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Orders database ID | `orders_db` |
| `NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID` | Orders collection ID | `orders` |

---

## 🎯 Next Steps

1. Complete the Appwrite setup following the steps above
2. Configure environment variables
3. Run the development server
4. Test order creation and delivery confirmation
5. Deploy to production (Vercel recommended)

---

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Realtime](https://appwrite.io/docs/realtime)

---

## License

MIT
