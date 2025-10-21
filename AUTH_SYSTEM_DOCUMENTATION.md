# Authentication & Session System Documentation

This document describes the comprehensive authentication and session management system implemented using Appwrite for the SharifRo Next.js application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [API Routes](#api-routes)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [Configuration](#configuration)

## Overview

The authentication system is built using:
- **Appwrite** (v20.1.0) - Client SDK for browser-side operations
- **node-appwrite** (v19.1.0) - Server SDK for API routes
- **Next.js App Router** - For routing and middleware
- **React Context API** - For global state management

## Architecture

### Client-Side Architecture

```
┌─────────────────────┐
│   React Components  │
│   (Pages/Forms)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   AuthContext       │
│   (Global State)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Appwrite Client SDK │
│ (Browser)           │
└─────────────────────┘
```

### Server-Side Architecture

```
┌─────────────────────┐
│   API Routes        │
│   (/api/auth/*)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Appwrite Server SDK │
│ (Node.js)           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Cookie-based      │
│   Session Storage   │
└─────────────────────┘
```

## Components

### 1. Client Configuration (`src/lib/appwrite.ts`)

Initializes the Appwrite client for browser-side operations:

```typescript
import { client, account, databases, storage, ID, Query } from '@/lib/appwrite';
```

### 2. Server Configuration (`src/lib/appwrite-server.ts`)

Provides server-side utilities for API routes:

- `createAdminClient()` - Creates an admin client with API key
- `createSessionClient()` - Creates a client using user's session cookie
- `getAuthenticatedUser()` - Gets the current authenticated user
- `setSessionCookie()` - Sets the session cookie
- `deleteSessionCookie()` - Deletes the session cookie

### 3. Auth Context (`src/contexts/AuthContext.tsx`)

Global authentication state provider with the following features:

#### State
- `user` - Current authenticated user
- `loading` - Loading state
- `error` - Error messages

#### Methods
- `signup(email, password, name)` - Register new user
- `login(email, password)` - Login existing user
- `logout()` - Logout and clear session
- `updateName(name)` - Update user's name
- `updateEmail(email, password)` - Update user's email
- `updatePassword(newPassword, oldPassword)` - Update password
- `updatePhone(phone, password)` - Update phone number
- `updatePreferences(prefs)` - Update user preferences
- `refreshUser()` - Refresh user data
- `checkSession()` - Check if session is active

### 4. Middleware (`src/middleware.ts`)

Protects routes and manages redirects:

- **Protected Routes**: `/role`, `/customer`, `/delivery`, `/courier`, `/account`, etc.
- **Auth Routes**: `/auth` (only accessible when not logged in)
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## API Routes

### Authentication

#### POST `/api/auth/signup`
Create a new user account and session.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "$id": "...",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "message": "Account created successfully"
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "$id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "prefs": {}
  },
  "message": "Login successful"
}
```

#### POST `/api/auth/logout`
Logout and delete session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/session`
Get current session and user information.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "$id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "prefs": {}
  },
  "session": {
    "$id": "...",
    "provider": "email",
    "expire": "..."
  }
}
```

### User Management

#### GET `/api/auth/user`
Get current user information.

#### PATCH `/api/auth/user`
Update user information.

**Request:**
```json
{
  "name": "New Name",
  "prefs": {
    "studentCode": "12345",
    "credit": 100
  }
}
```

#### PATCH `/api/auth/password`
Update user password.

**Request:**
```json
{
  "newPassword": "newpassword123",
  "oldPassword": "oldpassword123"
}
```

#### POST `/api/auth/password`
Request password recovery email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

### Preferences

#### GET `/api/auth/preferences`
Get user preferences.

#### PUT/PATCH `/api/auth/preferences`
Update user preferences.

**Request:**
```json
{
  "studentCode": "12345",
  "credit": 100,
  "phone": "+1234567890"
}
```

### Sessions

#### GET `/api/auth/sessions`
List all active sessions.

#### DELETE `/api/auth/sessions`
Delete all sessions (logout from all devices).

## Usage Examples

### 1. Using Auth Context in Components

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Login Form

```typescript
'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect handled by AuthContext
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 3. Update User Profile

```typescript
'use client'

import { useAuth } from '@/contexts/AuthContext';

export default function ProfileForm() {
  const { user, updateName, updatePreferences } = useAuth();

  const handleUpdate = async () => {
    try {
      await updateName('New Name');
      await updatePreferences({
        studentCode: '12345',
        credit: 100
      });
      alert('Profile updated!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <p>Current name: {user?.name}</p>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}
```

### 4. Server-Side Session Check

```typescript
import { getAuthenticatedUser } from '@/lib/appwrite-server';

export async function GET() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // User is authenticated
  return NextResponse.json({ user });
}
```

## Security Features

### 1. HttpOnly Cookies
Session cookies are set with `httpOnly: true` to prevent XSS attacks.

### 2. Secure Cookies
In production, cookies are set with `secure: true` to ensure HTTPS transmission.

### 3. SameSite Protection
Cookies use `sameSite: 'lax'` to prevent CSRF attacks.

### 4. Security Headers
Middleware adds security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 5. Password Requirements
- Minimum 8 characters
- Validated on both client and server

### 6. Session Validation
- Middleware validates session on every protected route
- Server-side session validation in API routes

### 7. Error Handling
- Generic error messages to prevent information disclosure
- Detailed logging for debugging

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Server-only API Key (never expose to client)
APPWRITE_API_KEY=your_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Appwrite Console Setup

1. Create a new project in Appwrite Console
2. Enable Email/Password authentication
3. Create an API key with the following scopes:
   - `users.read`
   - `users.write`
   - `sessions.read`
   - `sessions.write`
4. Add your domain to the platform (Web)

### User Preferences Schema

The system uses Appwrite's built-in user preferences to store additional data:

```typescript
interface UserPreferences {
  studentCode?: string;
  credit?: number;
  phone?: string;
  profileComplete?: boolean;
  role?: 'customer' | 'delivery' | 'courier';
}
```

## Best Practices

1. **Always use the AuthContext** in client components for auth operations
2. **Use server-side utilities** in API routes for secure operations
3. **Never expose the API key** to the client
4. **Validate input** on both client and server
5. **Handle errors gracefully** with user-friendly messages
6. **Use TypeScript** for type safety
7. **Test authentication flows** thoroughly

## Troubleshooting

### Session Cookie Not Set
- Ensure `NEXT_PUBLIC_APPWRITE_PROJECT_ID` is correct
- Check that the Appwrite endpoint is accessible
- Verify API key has correct permissions

### Redirect Loop
- Check middleware configuration
- Ensure protected routes are defined correctly
- Verify session cookie is being set properly

### User Not Loading
- Check browser console for errors
- Verify Appwrite project settings
- Check network tab for failed requests

## Migration from Old System

The old authentication system has been completely replaced. Key changes:

1. **Removed** `src/lib/useAuth.ts` (replaced by AuthContext)
2. **Updated** all auth-related pages to use `useAuth()` from AuthContext
3. **Created** comprehensive API routes for all auth operations
4. **Enhanced** middleware with better session validation
5. **Added** server-side utilities for API routes

## Future Enhancements

Potential improvements:

- [ ] OAuth2 providers (Google, GitHub, etc.)
- [ ] Email verification flow
- [ ] Phone number verification
- [ ] Two-factor authentication (2FA)
- [ ] Magic URL authentication
- [ ] Session management UI (view/delete sessions)
- [ ] Password reset flow
- [ ] Account deletion

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0


