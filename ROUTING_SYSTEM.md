# Routing System Documentation

This document explains how the routing and authentication system works in the SharifRo application.

## Overview

The routing system implements a comprehensive authentication flow that:
1. ✅ Checks user authentication status on initial load
2. ✅ Validates sessions with Appwrite server
3. ✅ Redirects authenticated users to `/role`
4. ✅ Redirects unauthenticated users to `/auth`
5. ✅ Protects routes that require authentication
6. ✅ Preserves intended destination for post-login redirect

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Visits Website                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Middleware (middleware.ts)                  │
│  - Checks for session cookie                            │
│  - Protects routes based on cookie presence             │
│  - Allows "/" to handle its own routing                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Root Page (app/page.tsx)                   │
│  - Uses AuthContext to check session validity           │
│  - Validates session with Appwrite                      │
│  - Redirects to /role or /auth based on result         │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌────────────────────┐        ┌─────────────────────┐
│  Authenticated     │        │  Not Authenticated   │
│  → /role           │        │  → /auth             │
└────────────────────┘        └─────────────────────┘
```

## Components

### 1. Root Page (`/`)

**File:** `src/app/page.tsx`

The landing page that performs the initial authentication check:

```typescript
export default function Home() {
  const { user, loading, checkSession } = useAuth();
  
  useEffect(() => {
    const handleInitialRoute = async () => {
      if (loading) return;
      
      const hasValidSession = await checkSession();
      
      if (hasValidSession && user) {
        router.replace('/role');
      } else {
        router.replace('/auth');
      }
    };
    
    handleInitialRoute();
  }, [user, loading, router, checkSession]);
  
  return <LoadingScreen />;
}
```

**Features:**
- ✅ Shows loading indicator during auth check
- ✅ Uses `checkSession()` to validate with Appwrite
- ✅ Uses `router.replace()` to avoid back button issues
- ✅ Handles errors gracefully

### 2. Middleware

**File:** `src/middleware.ts`

Edge middleware that runs before pages load:

```typescript
export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(`a_session_${projectId}`);
  const hasSession = !!sessionCookie?.value;
  
  // Allow root page to handle its own routing
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Protect routes that require authentication
  if (isProtectedRoute && !hasSession) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthRoute && hasSession) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const targetUrl = redirect || '/role';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }
}
```

**Features:**
- ✅ Protects routes before they load
- ✅ Preserves intended URL for post-login redirect
- ✅ Adds security headers to all responses
- ✅ Allows root page to handle its own logic

### 3. Auth Context

**File:** `src/contexts/AuthContext.tsx`

Global authentication state provider:

```typescript
const login = async (email: string, password: string) => {
  // Create session with Appwrite
  await account.createEmailPasswordSession(email, password);
  
  // Refresh user data
  await refreshUser();
  
  // Check for redirect URL
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get('redirect');
  
  // Redirect to original URL or /role
  router.push(redirect && redirect.startsWith('/') ? redirect : '/role');
};

const checkSession = async (): Promise<boolean> => {
  try {
    const currentUser = await account.get();
    setUser(currentUser);
    return true;
  } catch {
    setUser(null);
    return false;
  }
};
```

**Features:**
- ✅ Centralized authentication logic
- ✅ Session validation with Appwrite
- ✅ Automatic redirect handling
- ✅ Error handling and state management

### 4. Auth Page

**File:** `src/app/auth/page.tsx`

Login/signup page with redirect support:

```typescript
export default function AuthPage() {
  const [redirectMessage, setRedirectMessage] = useState('');
  const searchParams = useSearchParams();
  
  // Show message if redirected from protected route
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectMessage('Please login to access that page');
    }
  }, [searchParams]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/role');
    }
  }, [user, loading]);
}
```

**Features:**
- ✅ Shows message when redirected from protected route
- ✅ Preserves redirect URL through login flow
- ✅ Auto-redirects authenticated users
- ✅ Handles both login and signup

## Flow Diagrams

### Initial Website Visit

```
User visits https://yoursite.com/
         │
         ▼
┌────────────────────┐
│   Middleware       │
│   Allows "/" to    │
│   load normally    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   Root Page        │
│   Shows loading    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   AuthContext      │
│   checkSession()   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   Appwrite API     │
│   account.get()    │
└────────┬───────────┘
         │
    ┌────┴────┐
    │ Success?│
    └────┬────┘
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
  Valid         Invalid
  Session       Session
    │              │
    ▼              ▼
 /role          /auth
```

### Protected Route Access (Not Logged In)

```
User visits /account
         │
         ▼
┌────────────────────┐
│   Middleware       │
│   No session cookie│
└────────┬───────────┘
         │
         ▼
┌────────────────────────────┐
│   Redirect to:             │
│   /auth?redirect=/account  │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────┐
│   Auth Page        │
│   Shows message:   │
│   "Please login to │
│    access that page│
└────────┬───────────┘
         │
    User logs in
         │
         ▼
┌────────────────────┐
│   AuthContext      │
│   login() function │
│   Reads redirect   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   Redirect to:     │
│   /account         │
│   (original URL)   │
└────────────────────┘
```

### Login Flow

```
User fills login form
         │
         ▼
┌────────────────────────────┐
│   AuthContext.login()      │
│   - Create session         │
│   - Refresh user data      │
│   - Check redirect param   │
└────────┬───────────────────┘
         │
    ┌────┴────┐
    │ Redirect│
    │ param?  │
    └────┬────┘
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
  Yes             No
    │              │
    ▼              ▼
Redirect to    /role
original URL
```

### Logout Flow

```
User clicks logout
         │
         ▼
┌────────────────────────────┐
│   AuthContext.logout()     │
│   - Delete session         │
│   - Clear cookies          │
│   - Clear localStorage     │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────┐
│   Redirect to:     │
│   /auth            │
└────────────────────┘
```

## Protected Routes

The following routes require authentication:

- `/role` - Role selection page
- `/customer` - Customer dashboard
- `/delivery` - Delivery dashboard
- `/courier` - Courier dashboard
- `/account` - User account settings
- `/service` - Service selection
- `/grocery` - Grocery shopping
- `/order` - Order management
- `/waiting` - Waiting/queue page

## Public Routes

The following routes are accessible without authentication:

- `/` - Landing page (redirects based on auth status)
- `/auth` - Login/signup page (redirects if already authenticated)

## Session Management

### Session Creation

When a user logs in or signs up:
1. Appwrite creates a session
2. Session secret is stored in HttpOnly cookie
3. Cookie name format: `a_session_{projectId}`
4. Cookie includes expiry date from Appwrite

### Session Validation

Sessions are validated at multiple points:
1. **On initial load** - Root page checks with Appwrite
2. **On route change** - Middleware checks cookie presence
3. **In components** - AuthContext provides current user
4. **On API calls** - Server validates session

### Session Expiry

When a session expires:
1. Appwrite returns 401 error
2. AuthContext clears user state
3. User is redirected to `/auth`
4. Original URL is preserved for post-login redirect

## Security Features

### 1. HttpOnly Cookies
- Session cookie is HttpOnly
- Prevents XSS attacks
- Not accessible via JavaScript

### 2. Secure Cookies
- `secure: true` in production
- HTTPS-only transmission
- Protection against MITM attacks

### 3. SameSite Protection
- `sameSite: 'lax'`
- Prevents CSRF attacks
- Allows top-level navigation

### 4. Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 5. Redirect Validation
- Only allows redirects to internal URLs
- Checks that redirect starts with `/`
- Prevents open redirect vulnerabilities

## Best Practices

### 1. Always Use AuthContext
```typescript
// ✅ Good
const { user, loading } = useAuth();

// ❌ Bad
const user = await account.get(); // Direct API call
```

### 2. Handle Loading States
```typescript
// ✅ Good
if (loading) return <Loading />;
if (!user) return <Redirect />;

// ❌ Bad
if (!user) return <Redirect />; // Might flash before loading completes
```

### 3. Use router.replace() for Auth Redirects
```typescript
// ✅ Good
router.replace('/auth'); // Doesn't add to history

// ❌ Bad
router.push('/auth'); // Can cause back button issues
```

### 4. Validate Redirect URLs
```typescript
// ✅ Good
if (redirect && redirect.startsWith('/')) {
  router.push(redirect);
}

// ❌ Bad
router.push(redirect); // Could redirect to external site
```

## Troubleshooting

### Issue: Infinite Redirect Loop

**Symptoms:** Browser keeps redirecting between pages

**Solutions:**
1. Check browser cookies - ensure session cookie exists
2. Clear cookies and try logging in again
3. Verify `NEXT_PUBLIC_APPWRITE_PROJECT_ID` matches Appwrite Console
4. Check browser console for errors

### Issue: "Not Authenticated" After Login

**Symptoms:** Logged in but treated as unauthenticated

**Solutions:**
1. Check that session cookie is being set (Browser DevTools > Application > Cookies)
2. Verify cookie domain matches your site
3. Ensure `APPWRITE_API_KEY` is correct
4. Check Appwrite Console for active sessions

### Issue: Redirect URL Not Working

**Symptoms:** After login, redirects to `/role` instead of original URL

**Solutions:**
1. Check that redirect parameter is in URL: `/auth?redirect=/account`
2. Verify middleware is adding redirect parameter
3. Check AuthContext login function reads redirect parameter
4. Ensure redirect URL starts with `/`

### Issue: Session Expired Message

**Symptoms:** User logged out unexpectedly

**Solutions:**
1. Check session expiry time in Appwrite Console
2. Verify server time is correct
3. Consider implementing session refresh logic
4. Check for concurrent logouts (same user on multiple devices)

## Testing

### Test Case 1: Initial Visit (Not Logged In)
1. Clear all cookies
2. Visit `http://localhost:3000/`
3. Should see loading screen briefly
4. Should redirect to `/auth`

### Test Case 2: Initial Visit (Logged In)
1. Login to the app
2. Close browser tab
3. Visit `http://localhost:3000/`
4. Should see loading screen briefly
5. Should redirect to `/role`

### Test Case 3: Protected Route (Not Logged In)
1. Logout from app
2. Visit `http://localhost:3000/account`
3. Should redirect to `/auth?redirect=/account`
4. Should see message: "Please login to access that page"
5. After login, should redirect to `/account`

### Test Case 4: Auth Page (Already Logged In)
1. Login to the app
2. Visit `http://localhost:3000/auth`
3. Should immediately redirect to `/role`

### Test Case 5: Session Expiry
1. Login to the app
2. Wait for session to expire (or delete session in Appwrite Console)
3. Try to access any protected route
4. Should redirect to `/auth`

## Future Enhancements

Potential improvements to the routing system:

- [ ] Remember user's last visited page
- [ ] Session refresh before expiry
- [ ] Multi-tab session sync
- [ ] Offline session caching
- [ ] Progressive loading states
- [ ] Route-based permissions
- [ ] Role-based routing
- [ ] Custom redirect logic per route

---

**Last Updated:** October 21, 2025
**Version:** 1.0.0



