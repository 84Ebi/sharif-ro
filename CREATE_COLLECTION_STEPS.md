# 🔧 Creating the Verifications Collection - Step by Step

## Current Issue

**Error:** "Collection with the requested ID could not be found."

**Why:** The `verifications` collection doesn't exist in your Appwrite database yet.

**Solution:** Create it following these exact steps.

---

## ✅ Step-by-Step Instructions

### Step 1: Access Appwrite Console

1. Go to: **https://fra.cloud.appwrite.io**
2. Login to your account
3. Select your project: **Sharif-Ro** (Project ID: `68dacad8003e7b0deb82`)

### Step 2: Navigate to Databases

1. In the left sidebar, click **Databases**
2. Click on your database: `68e8f87e0003da022cc5`
   - (It might be named something like "sharifro_db" or similar)

### Step 3: Create Collection

1. Click the **"Create Collection"** button
2. Fill in:
   - **Collection ID:** `verifications` (EXACTLY this - must match env var)
   - **Collection Name:** `verifications` (or any display name you prefer)
3. Click **"Create"**

### Step 4: Add Attributes

Now you need to add 12 attributes. Click **"Create Attribute"** for each:

#### Attribute 1: userId
- Type: **String**
- Key: `userId`
- Size: `255`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 2: userName
- Type: **String**
- Key: `userName`
- Size: `255`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 3: userEmail
- Type: **Email**
- Key: `userEmail`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 4: userPhone
- Type: **String**
- Key: `userPhone`
- Size: `50`
- Required: **✗ No**
- Array: ✗ No
- Click **Create**

#### Attribute 5: studentCardFileId
- Type: **String**
- Key: `studentCardFileId`
- Size: `255`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 6: selfieFileId
- Type: **String**
- Key: `selfieFileId`
- Size: `255`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 7: bucketId
- Type: **String**
- Key: `bucketId`
- Size: `255`
- Required: **✓ Yes**
- Default Value: `6909fd2600093086c95b`
- Array: ✗ No
- Click **Create**

#### Attribute 8: status
- Type: **Enum**
- Key: `status`
- Elements: `pending`, `approved`, `rejected` (comma-separated)
- Required: **✓ Yes**
- Default Value: `pending`
- Array: ✗ No
- Click **Create**

#### Attribute 9: submittedAt
- Type: **DateTime**
- Key: `submittedAt`
- Required: **✓ Yes**
- Array: ✗ No
- Click **Create**

#### Attribute 10: reviewedAt
- Type: **DateTime**
- Key: `reviewedAt`
- Required: **✗ No**
- Array: ✗ No
- Click **Create**

#### Attribute 11: reviewedBy
- Type: **String**
- Key: `reviewedBy`
- Size: `255`
- Required: **✗ No**
- Array: ✗ No
- Click **Create**

#### Attribute 12: reviewNotes
- Type: **String**
- Key: `reviewNotes`
- Size: `1000`
- Required: **✗ No**
- Array: ✗ No
- Click **Create**

⚠️ **Important:** Wait for each attribute to be created before adding the next one!

### Step 5: Create Indexes

After all attributes are created, create these indexes for better performance:

#### Index 1: User ID Index
1. Click **"Create Index"**
2. Fill in:
   - **Index Key:** `idx_userId`
   - **Index Type:** Key
   - **Attributes:** Select `userId`
   - **Order:** ASC
3. Click **Create**

#### Index 2: Status Index
1. Click **"Create Index"**
2. Fill in:
   - **Index Key:** `idx_status`
   - **Index Type:** Key
   - **Attributes:** Select `status`
   - **Order:** ASC
3. Click **Create**

#### Index 3: Submitted Date Index
1. Click **"Create Index"**
2. Fill in:
   - **Index Key:** `idx_submittedAt`
   - **Index Type:** Key
   - **Attributes:** Select `submittedAt`
   - **Order:** DESC
3. Click **Create**

### Step 6: Set Permissions

1. In the collection settings, go to **"Permissions"** tab
2. Add these permissions:

**Read Permission:**
- Click **"Add Role"**
- Select: `Any`
- Or: `Users` (authenticated users)

**Create Permission:**
- Click **"Add Role"**
- Select: `Users`

**Update Permission:**
- Click **"Add Role"**
- Select: `Users`

**Delete Permission:**
- Click **"Add Role"**
- Select: `Users`

---

## ✅ Verification Checklist

After completing the steps, verify:

- [ ] Collection ID is exactly `verifications`
- [ ] All 12 attributes are created
- [ ] All 3 indexes are created
- [ ] Permissions are set (Read, Create, Update, Delete for `users`)

---

## 🚀 Test Again

Now try submitting verification again:

1. Go to: https://sharif-ro.vercel.app/delivery/verify
2. Upload student card and selfie
3. Click Submit
4. ✅ Should work now!

---

## 📋 Quick Attribute Reference

| # | Key | Type | Size | Required | Default |
|---|-----|------|------|----------|---------|
| 1 | userId | String | 255 | Yes | - |
| 2 | userName | String | 255 | Yes | - |
| 3 | userEmail | Email | - | Yes | - |
| 4 | userPhone | String | 50 | No | - |
| 5 | studentCardFileId | String | 255 | Yes | - |
| 6 | selfieFileId | String | 255 | Yes | - |
| 7 | bucketId | String | 255 | Yes | 6909fd26... |
| 8 | status | Enum | - | Yes | pending |
| 9 | submittedAt | DateTime | - | Yes | - |
| 10 | reviewedAt | DateTime | - | No | - |
| 11 | reviewedBy | String | 255 | No | - |
| 12 | reviewNotes | String | 1000 | No | - |

**Enum values for status:** `pending`, `approved`, `rejected`

---

## 💡 Tips

- **Wait between attributes:** Appwrite needs time to create each attribute
- **Check for typos:** Attribute keys must match exactly
- **Save progress:** You can come back if needed
- **Test incrementally:** After adding attributes, you can test

---

## 🆘 Troubleshooting

### "Attribute already exists"
- You might have started creating it before. Skip and continue.

### "Invalid enum values"
- Make sure to enter: `pending`, `approved`, `rejected`
- Separate with commas (no spaces): `pending,approved,rejected`

### "Collection not found" still appears
- Double-check the collection ID is exactly `verifications`
- Make sure you're in the correct database (`68e8f87e0003da022cc5`)
- Try restarting your Next.js dev server after creating the collection

---

## Alternative: Use CLI (Advanced)

If you prefer, you can use the Appwrite CLI. See `APPWRITE_SETUP_COMMANDS.md` for complete CLI commands.

---

Good luck! The collection creation takes about 5-10 minutes if done carefully.

