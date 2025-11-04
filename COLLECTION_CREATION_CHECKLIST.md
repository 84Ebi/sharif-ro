# ✅ Collection Creation Checklist

Use this as a quick checklist while creating the `verifications` collection.

## Access & Setup
- [ ] Logged into Appwrite Console (https://fra.cloud.appwrite.io)
- [ ] Navigated to Databases
- [ ] Selected database: `68e8f87e0003da022cc5`
- [ ] Clicked "Create Collection"
- [ ] Set Collection ID: `verifications`
- [ ] Set Collection Name: `verifications`
- [ ] Collection created successfully

## Attributes (12 total)

### String Attributes
- [ ] `userId` - String, 255, Required
- [ ] `userName` - String, 255, Required
- [ ] `userPhone` - String, 50, Not Required
- [ ] `studentCardFileId` - String, 255, Required
- [ ] `selfieFileId` - String, 255, Required
- [ ] `bucketId` - String, 255, Required, Default: `6909fd2600093086c95b`
- [ ] `reviewedBy` - String, 255, Not Required
- [ ] `reviewNotes` - String, 1000, Not Required

### Email Attribute
- [ ] `userEmail` - Email, Required

### Enum Attribute
- [ ] `status` - Enum (`pending,approved,rejected`), Required, Default: `pending`

### DateTime Attributes
- [ ] `submittedAt` - DateTime, Required
- [ ] `reviewedAt` - DateTime, Not Required

## Indexes (3 total)
- [ ] `idx_userId` - Key index on `userId` (ASC)
- [ ] `idx_status` - Key index on `status` (ASC)
- [ ] `idx_submittedAt` - Key index on `submittedAt` (DESC)

## Permissions
- [ ] Read: `Any` or `Users`
- [ ] Create: `Users`
- [ ] Update: `Users`
- [ ] Delete: `Users`

## Final Verification
- [ ] All 12 attributes visible in collection
- [ ] All 3 indexes created
- [ ] Permissions configured
- [ ] Collection ID is exactly `verifications`

## Test
- [ ] Restart Next.js dev server (if running locally)
- [ ] Navigate to /delivery/verify
- [ ] Upload student card
- [ ] Upload selfie
- [ ] Click Submit
- [ ] ✅ Verification submitted successfully!

---

**Estimated Time:** 10-15 minutes

**Current Status:** 
- ✅ Environment variables configured
- ✅ Storage bucket created (verifyimg)
- ⏳ Database collection (in progress)

Once all boxes are checked, the verification system will be fully operational! 🚀

