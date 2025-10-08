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

3. Create environment variables:

   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=
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
