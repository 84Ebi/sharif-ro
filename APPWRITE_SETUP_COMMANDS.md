# Appwrite Setup Commands

If you prefer using the Appwrite CLI, here are the exact commands to set up the verification system.

## Prerequisites

```bash
# Install Appwrite CLI (if not already installed)
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Set your project
appwrite client --endpoint https://fra.cloud.appwrite.io/v1 --projectId 68dacad8003e7b0deb82
```

## Create Storage Bucket

```bash
# Create bucket
appwrite storage createBucket \
  --bucketId "6909fd2600093086c95b" \
  --name "verifyimg" \
  --maximumFileSize 10485760 \
  --allowedFileExtensions "jpg,jpeg,png,heic,webp" \
  --compression "gzip" \
  --encryption true \
  --antivirus true

# Set bucket permissions
appwrite storage updateBucket \
  --bucketId "6909fd2600093086c95b" \
  --permissions "read(\"any\")" "create(\"users\")" "update(\"users\")"
```

## Create Database Collection

```bash
# Create collection
appwrite databases createCollection \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --name "verifications" \
  --permissions "read(\"users\")" "create(\"users\")" "update(\"users\")" "delete(\"users\")"

# Add attributes
appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "userId" \
  --size 255 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "userName" \
  --size 255 \
  --required true

appwrite databases createEmailAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "userEmail" \
  --required true

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "userPhone" \
  --size 50 \
  --required false

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "studentCardFileId" \
  --size 255 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "selfieFileId" \
  --size 255 \
  --required true

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "bucketId" \
  --size 255 \
  --required true \
  --default "6909fd2600093086c95b"

appwrite databases createEnumAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "status" \
  --elements "pending,approved,rejected" \
  --required true \
  --default "pending"

appwrite databases createDatetimeAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "submittedAt" \
  --required true

appwrite databases createDatetimeAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "reviewedAt" \
  --required false

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "reviewedBy" \
  --size 255 \
  --required false

appwrite databases createStringAttribute \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "reviewNotes" \
  --size 1000 \
  --required false

# Create indexes
appwrite databases createIndex \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "idx_userId" \
  --type "key" \
  --attributes "userId" \
  --orders "ASC"

appwrite databases createIndex \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "idx_status" \
  --type "key" \
  --attributes "status" \
  --orders "ASC"

appwrite databases createIndex \
  --databaseId "sharifro_db" \
  --collectionId "verifications" \
  --key "idx_submittedAt" \
  --type "key" \
  --attributes "submittedAt" \
  --orders "DESC"
```

## Verify Setup

```bash
# List buckets
appwrite storage listBuckets

# List collections
appwrite databases listCollections --databaseId "sharifro_db"

# List collection attributes
appwrite databases listAttributes \
  --databaseId "sharifro_db" \
  --collectionId "verifications"

# List collection indexes
appwrite databases listIndexes \
  --databaseId "sharifro_db" \
  --collectionId "verifications"
```

## Notes

- Replace `sharifro_db` with your actual database ID if different
- Ensure you have proper permissions to create buckets and collections
- CLI commands may vary slightly depending on Appwrite CLI version
- For production, consider using Appwrite's Infrastructure as Code (IaC) for version control

## Alternative: Manual Setup via Console

If CLI commands don't work, use the Appwrite Console:

1. **Storage → Create Bucket**
   - Follow steps in `QUICK_START_VERIFICATION.md`

2. **Databases → Create Collection**
   - Follow steps in `QUICK_START_VERIFICATION.md`

## Troubleshooting

**Command not found:**
```bash
npm install -g appwrite-cli
```

**Authentication failed:**
```bash
appwrite login
# Follow the prompts
```

**Project not found:**
```bash
appwrite client --projectId 68dacad8003e7b0deb82
```

**Permission denied:**
- Ensure your API key has admin permissions
- Or use console for manual setup

## After Setup

1. Set environment variables in `.env.local`
2. Restart your Next.js development server
3. Test the verification page
4. Check files are uploading to bucket
5. Verify documents are created in collection

Done! 🎉



