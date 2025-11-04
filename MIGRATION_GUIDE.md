# Migration Guide - New Auth System

This guide will help you migrate from the old authentication system to the new comprehensive Appwrite-based system.

## What Changed

### ✅ New Features
- Comprehensive authentication context with global state management
- Server-side API routes for all auth operations
- Enhanced security with HttpOnly cookies
- Better session management
- Type-safe authentication throughout the app
- Proper error handling and user feedback
- Session validation in middleware
- User preferences management

### ❌ Removed/Replaced
- Old `src/lib/useAuth.ts` hook → Replaced with `AuthContext`
- Direct Appwrite client calls in components → Now use `useAuth()` hook
- Server-side Account operations without proper session handling

## Step-by-Step Migration

### 1. Environment Variables

Ensure your `.env.local` file has these variables:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```

### 2. Update Imports

**Old:**
```typescript
import { account } from '@/lib/appwrite';
import { useAuth } from '@/lib/useAuth'; // Old hook
```

**New:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
// Only import from @/lib/appwrite if you need client, databases, storage, etc.
```

### 3. Update Auth Operations

**Old Pattern:**
```typescript
const [user, setUser] = useState(null);

// Login
const login = async () => {
  await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  setUser(user);
};

// Logout
const logout = async () => {
  await account.deleteSession('current');
  setUser(null);
};
```

**New Pattern:**
```typescript
const { user, login, logout, loading } = useAuth();

// Login
await login(email, password);
// Redirect is handled automatically

// Logout
await logout();
// Redirect is handled automatically
```

### 4. Update Component Patterns

**Old:**
```typescript
export default function MyComponent() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => router.push('/auth'));
  }, []);
  
  if (!user) return <div>Loading...</div>;
  
  return <div>Welcome {user.name}</div>;
}
```

**New:**
```typescript
export default function MyComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Redirecting...</div>;
  
  return <div>Welcome {user.name}</div>;
}
```

### 5. Update User Profile Updates

**Old:**
```typescript
const updateProfile = async () => {
  await account.updateName(name);
  await account.updatePrefs({ studentCode, phone });
  const updated = await account.get();
  setUser(updated);
};
```

**New:**
```typescript
const { updateName, updatePreferences, refreshUser } = useAuth();

const updateProfile = async () => {
  await updateName(name);
  await updatePreferences({ studentCode, phone });
  // User state is automatically refreshed
};
```

## Files Modified

### New Files Created
- ✨ `src/lib/appwrite-server.ts` - Server-side Appwrite utilities
- ✨ `src/contexts/AuthContext.tsx` - Global authentication context
- ✨ `src/app/api/auth/signup/route.ts` - Signup API
- ✨ `src/app/api/auth/login/route.ts` - Login API
- ✨ `src/app/api/auth/logout/route.ts` - Logout API
- ✨ `src/app/api/auth/session/route.ts` - Session check API
- ✨ `src/app/api/auth/user/route.ts` - User management API
- ✨ `src/app/api/auth/password/route.ts` - Password management API
- ✨ `src/app/api/auth/preferences/route.ts` - Preferences API
- ✨ `src/app/api/auth/sessions/route.ts` - Sessions management API

### Files Updated
- 🔄 `src/lib/appwrite.ts` - Enhanced with better types and exports
- 🔄 `src/middleware.ts` - Improved session validation and redirects
- 🔄 `src/app/layout.tsx` - Added AuthProvider
- 🔄 `src/app/auth/page.tsx` - Uses AuthContext
- 🔄 `src/app/auth/details/page.tsx` - Uses AuthContext
- 🔄 `src/app/account/page.tsx` - Uses AuthContext
- 🔄 `src/app/role/page.tsx` - Uses AuthContext

### Files Deleted
- ❌ `src/lib/useAuth.ts` - Replaced by AuthContext

## Testing the Migration

### 1. Test Signup Flow
1. Navigate to `/auth`
2. Click "Register for free"
3. Fill in name, email, and password
4. Submit form
5. Should redirect to `/auth/details`
6. Fill in additional details
7. Should redirect to `/role`

### 2. Test Login Flow
1. Navigate to `/auth`
2. Enter email and password
3. Submit form
4. Should redirect to `/role`

### 3. Test Protected Routes
1. Logout from the app
2. Try accessing `/account` directly
3. Should redirect to `/auth`
4. Login again
5. Should redirect back to `/account` (or `/role`)

### 4. Test Logout
1. Login to the app
2. Navigate to `/account`
3. Click "Logout"
4. Should redirect to `/auth`
5. Try accessing protected routes - should redirect to `/auth`

### 5. Test User Updates
1. Login to the app
2. Navigate to `/account`
3. Click "Edit" on name field
4. Change name and save
5. Refresh page - name should persist

## Common Issues & Solutions

### Issue: "Cannot find module '@/contexts/AuthContext'"

**Solution:** Make sure TypeScript paths are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Session not persisting after login

**Solution:** 
- Check that `NEXT_PUBLIC_APPWRITE_PROJECT_ID` matches your Appwrite project
- Clear browser cookies and try again
- Check browser console for errors

### Issue: "No session found" error

**Solution:**
- Ensure `APPWRITE_API_KEY` is set in `.env.local`
- Verify the API key has correct permissions in Appwrite Console
- Restart the development server after changing env vars

### Issue: Infinite redirect loop

**Solution:**
- Check middleware configuration
- Ensure session cookie is being set correctly
- Check browser dev tools > Application > Cookies

### Issue: TypeScript errors after migration

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and restart dev server
- Check for any missing type imports

## Rollback Plan

If you need to rollback:

1. Restore the old `src/lib/useAuth.ts` from git history
2. Revert changes to component files
3. Remove new API routes
4. Revert middleware changes
5. Remove AuthContext from layout.tsx

**Command:**
```bash
git checkout HEAD~1 -- src/lib/useAuth.ts
git checkout HEAD~1 -- src/app/auth/page.tsx
# ... etc for other files
```

## Benefits of New System

✅ **Better Security**
- HttpOnly cookies prevent XSS attacks
- Server-side session validation
- Proper error handling without information leakage

✅ **Better DX (Developer Experience)**
- Centralized auth logic
- Type-safe operations
- Cleaner component code
- Better error handling

✅ **Better UX (User Experience)**
- Automatic redirects
- Proper loading states
- Better error messages
- Persistent sessions

✅ **Scalability**
- Easy to add OAuth providers
- Easy to add 2FA
- Easy to add email verification
- Clean separation of concerns

## Need Help?

Check the [AUTH_SYSTEM_DOCUMENTATION.md](./AUTH_SYSTEM_DOCUMENTATION.md) for detailed API documentation and usage examples.

---

**Migration Date:** October 20, 2025
**By:** AI Assistant





