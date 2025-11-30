# Chat Authentication Fix

## Problem
The chat feature was failing with "Not authenticated. Please log in." error because:
1. Client-side Appwrite SDK stores sessions in localStorage
2. API routes expect sessions in cookies
3. When users log in via AuthContext, only localStorage session was created, not the cookie

## Solution
Modified `AuthContext.tsx` to sync the session to server-side cookie after client-side login:

1. **After client-side login/signup**: The AuthContext now calls `/api/auth/login` API route in the background
2. **Login API route**: Creates a server-side session and sets it as a cookie
3. **API routes**: Can now read the session from cookies using `createSessionClient()`

## Changes Made

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
- Modified `login()` function to call `/api/auth/login` after client-side login
- Modified `signup()` function to call `/api/auth/login` after client-side signup
- Calls are made in the background (non-blocking) so client-side login still works even if API call fails

### 2. Chat API (`src/app/api/chat/[orderId]/route.ts`)
- Already has proper error handling for missing sessions
- Returns 401 with clear error message when session is not found

### 3. Chat Client (`src/lib/chat.ts`)
- Added `credentials: 'include'` to fetch requests to ensure cookies are sent

## Testing

After these changes:
1. Log in to the application
2. The session should be synced to both localStorage (client) and cookie (server)
3. Chat should now work without authentication errors

## Troubleshooting

If chat still shows "Not authenticated" error:
1. Check browser dev tools → Application → Cookies to see if `a_session_<project_id>` cookie exists
2. Check browser console for any errors during login
3. Verify that `/api/auth/login` is being called after login (check Network tab)
4. Make sure `credentials: 'include'` is set in all fetch requests to chat API

## Note

The session sync happens asynchronously in the background. If the API call fails, client-side features will still work, but server-side API routes (like chat) may not work until the user logs in again or the session is properly synced.


