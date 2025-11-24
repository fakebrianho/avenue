import { MongoClient } from 'mongodb'

// Check if we have a MongoDB URI
if (!process.env.MONGODB_URI) {
	throw new Error('Please add your MongoDB URI to .env.local')
}

// Parse the existing URI
let uri = process.env.MONGODB_URI
const dbName = 'mouthwash_db' // Hardcoded database name

// Clean and rebuild the URI to ensure proper format
let baseUri = uri.split('?')[0]
// Remove any existing database name from the URI
if (baseUri.endsWith('/')) {
	baseUri = baseUri.slice(0, -1)
}
// Remove existing database if present
const uriParts = baseUri.split('/')
if (uriParts.length > 3) {
	baseUri = uriParts.slice(0, 3).join('/')
}

// Rebuild URI with proper database and SSL options
uri = `${baseUri}/${dbName}?retryWrites=true&w=majority&ssl=true`

console.log(`Connecting to MongoDB database: ${dbName}`)

const options = {
	serverSelectionTimeoutMS: 30000, // Increased to 30 seconds for paused clusters
	connectTimeoutMS: 30000,
	maxPoolSize: 10,
	retryWrites: true,
	retryReads: true,
	ssl: true,
	tlsAllowInvalidCertificates: false,
	tlsAllowInvalidHostnames: false,
}

let client
let clientPromise

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options)
		global._mongoClientPromise = client.connect()
	}
	clientPromise = global._mongoClientPromise
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options)
	clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Helper to always get the bero database
export async function getDb() {
	try {
		const client = await clientPromise
		return client.db(dbName)
	} catch (error) {
		console.error('MongoDB connection failed:', {
			message: error.message,
			code: error.code,
			name: error.name,
		})

		// Provide helpful error messages
		if (error.message.includes('ssl') || error.message.includes('SSL')) {
			console.error(
				'💡 This looks like an SSL issue. Your MongoDB Atlas cluster might be paused.'
			)
			console.error(
				'💡 Try resuming your cluster in the MongoDB Atlas dashboard.'
			)
		}

		throw error
	}
}

// Add a unique index on sessionID
export async function addSessionIDIndex() {
	const db = await getDb()
	await db
		.collection('user_collection')
		.createIndex({ sessionID: 1 }, { unique: true })
}
