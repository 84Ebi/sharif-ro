# Food Hall Delivery Ordering System

A Next.js webapp for university food hall delivery ordering.

## Features

- **Order Submission**: Users can submit orders with food hall code, contact info, and delivery details.
- **Waiting Page**: Shows order status and estimated waiting time.
- **Delivery Dashboard**: Secure login for delivery personnel to view and accept unassigned orders.

## Tech Stack

- Next.js 14 (App Router)
- Appwrite (Database & Auth)
- TailwindCSS
- TypeScript

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Set up Appwrite:

   - Create an Appwrite project at https://appwrite.io
   - Create two databases:
     - Temporary Orders DB with ID: `68dad04a0039da9eb348`
     - Permanent Orders DB with ID: `68dad08a0025eb52dbbf`
   - In each database, create a collection named `orders` with the following attributes (all strings unless specified):
     - `orderCode` (string, required)
     - `name` (string, required)
     - `phone` (string, required)
     - `email` (string, optional)
     - `address` (string, required)
     - `instructions` (string, optional)
     - `createdAt` (datetime, required)
     - For Permanent Orders DB only, add:
       - `assigned` (boolean, default: false)
       - `deliveryPerson` (string, optional)
   - Set collection permissions to allow read/write for authenticated users or as needed.
   - Create user accounts for delivery personnel in Appwrite Auth.

3. Create environment variables:

   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=68dacad8003e7b0deb82
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Pages

- `/` - Order form
- `/waiting` - Waiting page after order submission
- `/delivery` - Delivery dashboard (requires login)

## Deployment

Deploy on Vercel or any platform supporting Next.js. Ensure environment variables are set.
