import dotenv from 'dotenv'
import { Client, Databases, Permission, Role } from 'node-appwrite'

// Configure dotenv to load environment variables
dotenv.config({ path: '.env.local' })

const client = new Client()

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1'
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68dacad8003e7b0deb82'
const apiKey = process.env.APPWRITE_API_KEY

if (!apiKey) {
  console.error('Error: APPWRITE_API_KEY is not set in .env.local')
  process.exit(1)
}

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68e8f87e0003da022cc5'
const COLLECTION_ID = 'exchange_listings'

async function setupExchangeCollection() {
  try {
    console.log(`Setting up Exchange collection in database: ${DATABASE_ID}`)

    // 1. Create Collection (if it doesn't exist, catch error)
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTION_ID,
        'Exchange Listings',
        [
          Permission.read(Role.any()), // Public read access
          Permission.create(Role.users()), // Authenticated users can create
          Permission.update(Role.users()), // Users can update (we might want to restrict this to owner via document security, but collection level is a start)
          Permission.delete(Role.users()),
        ],
        true // Document Security enabled (important so users can only edit their own listings if we set permissions correctly on creation)
      )
      console.log('Collection created.')
    } catch (error: any) {
      if (error.code === 409) {
        console.log('Collection already exists. Updating permissions...')
        // Update permissions just in case
        await databases.updateCollection(
            DATABASE_ID, 
            COLLECTION_ID, 
            'Exchange Listings', 
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ],
            true
        )
        console.log('Permissions updated.')
      } else {
        throw error
      }
    }

    // 2. Create Attributes
    const attributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'userName', type: 'string', size: 255, required: true },
      { key: 'userCardNumber', type: 'string', size: 255, required: true },
      { key: 'itemType', type: 'string', size: 50, required: true },
      { key: 'itemName', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'price', type: 'integer', required: true },
      { key: 'status', type: 'string', size: 20, required: true }, // active, sold, cancelled, flagged, expired
      { key: 'buyerId', type: 'string', size: 255, required: false },
      { key: 'flagCount', type: 'integer', required: true }, // Removed default: 0 because it's required
      { key: 'flagReasons', type: 'string', size: 255, required: false, array: true },
      { key: 'codeValue', type: 'string', size: 1000, required: false }, // The actual code/voucher
      { key: 'expiresAt', type: 'datetime', required: true },
      { key: 'paymentConfirmedAt', type: 'datetime', required: false },
    ]

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.size as number, attr.required, undefined, attr.array)
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.required, 0, 2147483647, (attr as any).default)
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.required)
        }
        console.log(`Attribute '${attr.key}' created/verified.`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`Attribute '${attr.key}' already exists.`)
        } else {
          console.error(`Error creating attribute '${attr.key}':`, error)
        }
      }
    }

    // 3. Create Indexes
    // We need indexes for queries: status, expiresAt, userId, createdAt
    const indexes = [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_expiresAt', type: 'key', attributes: ['expiresAt'] },
      { key: 'idx_userId', type: 'key', attributes: ['userId'] },
      // { key: 'idx_created', type: 'key', attributes: ['$createdAt'] } // System attributes are indexed by default usually, but sometimes need explicit index for sorting? Appwrite indexes $createdAt automatically.
    ]

    for (const idx of indexes) {
      try {
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, idx.key, idx.type as any, idx.attributes)
        console.log(`Index '${idx.key}' created.`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`Index '${idx.key}' already exists.`)
        } else {
          console.error(`Error creating index '${idx.key}':`, error)
        }
      }
    }

    console.log('Exchange collection setup complete!')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupExchangeCollection()
