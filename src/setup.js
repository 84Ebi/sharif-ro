require('dotenv').config({ path: '.env.local' })

const { Client, Databases } = require('appwrite')

const client = new Client()

client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY)

const databases = new Databases(client)

const tempDbId = '68dad04a0039da9eb348'
const permDbId = '68dad08a0025eb52dbbf'
const collectionId = 'orders'

async function createCollections() {
  try {
    console.log('Creating Temporary Orders database...')
    await databases.create(tempDbId, 'Temporary Orders')

    console.log('Creating Permanent Orders database...')
    await databases.create(permDbId, 'Permanent Orders')

    console.log('Creating collection in temp DB...')
    await databases.createCollection(tempDbId, collectionId, 'Orders', [], false)

    console.log('Adding attributes to temp DB collection...')
    await databases.createStringAttribute(tempDbId, collectionId, 'orderCode', 255, true)
    await databases.createStringAttribute(tempDbId, collectionId, 'name', 255, true)
    await databases.createStringAttribute(tempDbId, collectionId, 'phone', 20, true)
    await databases.createStringAttribute(tempDbId, collectionId, 'email', 255, false)
    await databases.createStringAttribute(tempDbId, collectionId, 'address', 500, true)
    await databases.createStringAttribute(tempDbId, collectionId, 'instructions', 500, false)
    await databases.createDatetimeAttribute(tempDbId, collectionId, 'createdAt', true)

    console.log('Creating collection in perm DB...')
    await databases.createCollection(permDbId, collectionId, 'Orders', [], false)

    console.log('Adding attributes to perm DB collection...')
    await databases.createStringAttribute(permDbId, collectionId, 'orderCode', 255, true)
    await databases.createStringAttribute(permDbId, collectionId, 'name', 255, true)
    await databases.createStringAttribute(permDbId, collectionId, 'phone', 20, true)
    await databases.createStringAttribute(permDbId, collectionId, 'email', 255, false)
    await databases.createStringAttribute(permDbId, collectionId, 'address', 500, true)
    await databases.createStringAttribute(permDbId, collectionId, 'instructions', 500, false)
    await databases.createDatetimeAttribute(permDbId, collectionId, 'createdAt', true)
    await databases.createBooleanAttribute(permDbId, collectionId, 'assigned', false)
    await databases.createStringAttribute(permDbId, collectionId, 'deliveryPerson', 255, false)

    console.log('Databases and collections created successfully!')
  } catch (error) {
    console.error('Error creating databases/collections:', error)
  }
}

createCollections()