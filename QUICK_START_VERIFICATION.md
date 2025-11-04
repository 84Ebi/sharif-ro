# Quick Start Guide - Delivery Verification System

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Create Appwrite Storage Bucket

1. Go to Appwrite Console: https://fra.cloud.appwrite.io
2. Navigate to **Storage** → **Create Bucket**
3. Use these settings:
   - **Bucket ID:** `6909fd2600093086c95b`
   - **Bucket Name:** `verifyimg`
   - **Max File Size:** 10485760 (10MB)
   - **Allowed File Extensions:** `jpg,jpeg,png,heic,webp`
   - **Compression:** Enabled
   - **Antivirus:** Enabled

4. Set Permissions:
   - **Read:** Add role `any`
   - **Create:** Add role `users`
   - **Update:** Add role `users`

### Step 2: Create Database Collection

1. Navigate to **Databases** → Select your database (`sharifro_db`)
2. Click **Create Collection**
3. Use these settings:
   - **Collection ID:** `verifications`
   - **Collection Name:** `verifications`

4. Add these attributes (click **Add Attribute**):

```
1. userId - String, 255, Required
2. userName - String, 255, Required
3. userEmail - Email, 255, Required
4. userPhone - String, 50, Not Required
5. studentCardFileId - String, 255, Required
6. selfieFileId - String, 255, Required
7. bucketId - String, 255, Required, Default: "6909fd2600093086c95b"
8. status - Enum (pending,approved,rejected), Required, Default: "pending"
9. submittedAt - DateTime, Required
10. reviewedAt - DateTime, Not Required
11. reviewedBy - String, 255, Not Required
12. reviewNotes - String, 1000, Not Required
```

5. Create Indexes (click **Create Index**):
   - **idx_userId:** Key index on `userId` (ASC)
   - **idx_status:** Key index on `status` (ASC)  
   - **idx_submittedAt:** Key index on `submittedAt` (DESC)

6. Set Permissions:
   - **Read:** Add role `users`
   - **Create:** Add role `users`
   - **Update:** Add role `users`
   - **Delete:** Add role `users`

### Step 3: Set Environment Variables

Create/update `.env.local` in your project root:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68dacad8003e7b0deb82
APPWRITE_API_KEY=your_api_key_here

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=sharifro_db
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders

# Verification Configuration
NEXT_PUBLIC_APPWRITE_VERIFICATION_BUCKET_ID=6909fd2600093086c95b
NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID=verifications
```

**Get your API Key:**
1. Appwrite Console → Settings → API Keys
2. Create new key with scopes:
   - `databases.read`, `databases.write`
   - `users.read`, `users.write`
   - `storage.read`, `storage.write`

### Step 4: Deploy and Test

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

### Step 5: Test the System

**User Side:**
1. Go to: http://localhost:3000/delivery/verify
2. Login as a delivery partner
3. Upload a student card image
4. Upload a selfie image
5. Click "Submit for Verification"
6. You should see success message

**Admin Side:**
1. Go to: http://localhost:3000/admin/verifications
2. You should see the pending verification
3. Click on it to view details
4. You should see both uploaded images
5. Click "Approve" or "Reject"
6. Verification status should update

**Verify in Appwrite:**
1. Check Storage → `verifyimg` bucket → Should have 2 files
2. Check Database → `verifications` collection → Should have 1 document
3. File IDs should match: `{userId}_studentcard_{timestamp}`, `{userId}_selfie_{timestamp}`

## 🎉 You're Done!

The verification system is now fully functional!

### URLs
- **User Verification:** https://sharif-ro.vercel.app/delivery/verify
- **Admin Dashboard:** https://sharif-ro.vercel.app/admin/verifications

### What's Working
✅ Users can submit verification documents  
✅ Files uploaded to Appwrite Storage  
✅ Images linked to user IDs  
✅ Admins can review and approve/reject  
✅ Status tracking and updates  

### Common Issues

**Problem:** "Failed to submit verification"  
**Solution:** Check bucket ID matches `6909fd2600093086c95b` and permissions are set

**Problem:** "No session found"  
**Solution:** Make sure user is logged in

**Problem:** Images not showing in admin dashboard  
**Solution:** Check bucket permissions allow `any` to read files

**Problem:** API errors  
**Solution:** Verify API key has correct scopes and environment variables are set

## Need More Help?

See detailed documentation:
- `VERIFICATION_SETUP.md` - Complete setup guide
- `VERIFICATION_IMPLEMENTATION.md` - Technical details
- Check browser console for errors
- Check Appwrite Console logs

Happy verifying! 🚀

