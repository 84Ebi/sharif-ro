# Delivery Verification System Setup

This guide explains how to set up the delivery verification system with Appwrite storage.

## Overview

The verification system allows delivery partners to submit their student card and selfie images for manual review by admins. Images are stored in Appwrite Storage and linked to user IDs through a database collection.

## Appwrite Configuration

### 1. Storage Bucket Setup

**Bucket Name:** `verifyimg`  
**Bucket ID:** `6909fd2600093086c95b`

#### Bucket Permissions

Configure the bucket with the following permissions:

**Read Access:**
- Role: `any` (to allow admins to view images)

**Create Access:**
- Role: `users` (authenticated users can upload their verification images)

**Update/Delete Access:**
- Role: `users` (users can update their verification if rejected)

#### File Settings

- **Max File Size:** 10MB
- **Allowed File Extensions:** `jpg`, `jpeg`, `png`, `heic`, `webp`
- **Compression:** Enabled (optional)
- **Antivirus:** Enabled (recommended)

### 2. Database Collection Setup

**Collection Name:** `verifications`  
**Collection ID:** `verifications`

#### Attributes

Create the following attributes in your collection:

| Attribute Name | Type | Size | Required | Array | Default |
|----------------|------|------|----------|-------|---------|
| userId | String | 255 | Yes | No | - |
| userName | String | 255 | Yes | No | - |
| userEmail | Email | 255 | Yes | No | - |
| userPhone | String | 50 | No | No | - |
| studentCardFileId | String | 255 | Yes | No | - |
| selfieFileId | String | 255 | Yes | No | - |
| bucketId | String | 255 | Yes | No | 6909fd2600093086c95b |
| status | Enum | - | Yes | No | pending |
| submittedAt | DateTime | - | Yes | No | - |
| reviewedAt | DateTime | - | No | No | - |
| reviewedBy | String | 255 | No | No | - |
| reviewNotes | String | 1000 | No | No | - |

#### Status Enum Values
- `pending`
- `approved`
- `rejected`

#### Indexes

Create the following indexes for better query performance:

1. **Index Name:** `idx_userId`
   - Type: Key
   - Attributes: `userId`
   - Order: ASC

2. **Index Name:** `idx_status`
   - Type: Key
   - Attributes: `status`
   - Order: ASC

3. **Index Name:** `idx_submittedAt`
   - Type: Key
   - Attributes: `submittedAt`
   - Order: DESC

#### Collection Permissions

**Read Access:**
- Role: `users` (users can read their own verifications)

**Create Access:**
- Role: `users` (authenticated users can create verification requests)

**Update Access:**
- Role: `users` (for admin operations via API)

**Delete Access:**
- Role: `users` (for admin operations via API)

### 3. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68dacad8003e7b0deb82
APPWRITE_API_KEY=your_api_key_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=sharifro_db
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_APPWRITE_VERIFICATION_BUCKET_ID=6909fd2600093086c95b
NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID=verifications
```

## How It Works

### User Flow

1. **Access Verification Page**
   - User navigates to `/delivery/verify`
   - System checks if user is logged in
   - System checks if user has existing verification

2. **Upload Documents**
   - User uploads student card image
   - User uploads selfie image
   - Preview shows before submission

3. **Submission Process**
   - Files are uploaded to Appwrite Storage bucket with IDs: `{userId}_studentcard_{timestamp}` and `{userId}_selfie_{timestamp}`
   - Verification document is created in database with:
     - User information
     - File IDs linking to uploaded images
     - Initial status: `pending`
     - Submission timestamp

4. **Status Check**
   - If user already has a verification:
     - **Pending:** Shows waiting message
     - **Approved:** Shows success message, can access delivery dashboard
     - **Rejected:** Can resubmit verification

### Admin Review Flow

1. **Access Admin Panel** (to be implemented)
   - Admin views pending verifications
   - Can filter by status, date, etc.

2. **Review Verification**
   - View student card and selfie images
   - Verify student identity
   - Approve or reject with notes

3. **Update Status**
   - Change status to `approved` or `rejected`
   - Add review notes
   - Set `reviewedAt` timestamp
   - Set `reviewedBy` with admin ID

4. **User Notification**
   - User's `emailVerification` field updated to `true` if approved
   - User can access delivery dashboard if approved

## File Naming Convention

Files are stored with the following naming pattern:
- Student Card: `{userId}_studentcard_{timestamp}`
- Selfie: `{userId}_selfie_{timestamp}`

This ensures:
- Easy identification of files by user
- No filename conflicts
- Chronological ordering if user resubmits

## Security Considerations

1. **Authentication Required**
   - Only logged-in users can access verification page
   - Only authenticated users can upload files

2. **File Validation**
   - Client-side: File type and size checks
   - Server-side: Appwrite validates file extensions and size

3. **User Data Linking**
   - Files are linked to user ID in database
   - Admin can trace files back to specific users

4. **Admin Only Review**
   - Only admins can approve/reject verifications
   - All reviews are logged with reviewer ID and notes

## Next Steps

To complete the verification system, you need to:

1. ✅ Set up Appwrite bucket `verifyimg` with ID `6909fd2600093086c95b`
2. ✅ Configure bucket permissions
3. ✅ Create `verifications` collection with proper attributes
4. ✅ Configure collection permissions
5. ✅ Set environment variables
6. 🔲 Create admin panel for reviewing verifications
7. 🔲 Implement email notifications for approval/rejection
8. 🔲 Add user profile update logic to set `emailVerification` on approval

## API Endpoints (To Be Implemented)

### Get Pending Verifications
```typescript
GET /api/admin/verifications?status=pending
```

### Review Verification
```typescript
POST /api/admin/verifications/[id]/review
{
  status: 'approved' | 'rejected',
  reviewNotes: string
}
```

### Get User Verification Status
```typescript
GET /api/auth/verification
```

## Testing

1. Create a test user account
2. Navigate to `/delivery/verify`
3. Upload test images (student card and selfie)
4. Submit verification
5. Check Appwrite Storage for uploaded files
6. Check database for verification document
7. Verify file IDs match and are linked to user

## Troubleshooting

### "Failed to submit verification"
- Check if bucket exists and has correct ID
- Verify bucket permissions allow `users` role to create files
- Check file size and format
- Check environment variables are set correctly

### "No session found"
- User must be logged in
- Check authentication state
- Verify session cookie is present

### Images not showing
- Check bucket permissions allow reading files
- Verify file IDs are stored correctly in database
- Check if files were actually uploaded to storage

