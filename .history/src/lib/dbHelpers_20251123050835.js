import db from './db'

// Create a new document
export async function insert(collection, document) {
	return new Promise((resolve, reject) => {
		db[collection].insert(document, (err, newDoc) => {
			if (err) reject(err)
			else resolve(newDoc)
		})
	})
}

// Find documents matching a query
export async function find(collection, query = {}) {
	return new Promise((resolve, reject) => {
		db[collection].find(query, (err, docs) => {
			if (err) reject(err)
			else resolve(docs)
		})
	})
}

// Find a single document
export async function findOne(collection, query = {}) {
	return new Promise((resolve, reject) => {
		db[collection].findOne(query, (err, doc) => {
			if (err) reject(err)
			else resolve(doc)
		})
	})
}

// Update documents
export async function update(collection, query, update, options = {}) {
	return new Promise((resolve, reject) => {
		db[collection].update(query, update, options, (err, numAffected) => {
			if (err) reject(err)
			else resolve(numAffected)
		})
	})
}

// Remove documents
export async function remove(collection, query, options = {}) {
	return new Promise((resolve, reject) => {
		db[collection].remove(query, options, (err, numRemoved) => {
			if (err) reject(err)
			else resolve(numRemoved)
		})
	})
}
