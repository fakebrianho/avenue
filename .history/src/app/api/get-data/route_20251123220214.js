import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// Cache headers for better performance
const CACHE_HEADERS = {
	'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
}

export async function GET(request) {
	try {
		const db = await getDb()
		const collection = db.collection('memory')
		
		// Get index from query parameters
		const { searchParams } = new URL(request.url)
		const index = searchParams.get('index')
		
		if (index !== null) {
			// Get specific element by index
			const indexNum = parseInt(index, 10)
			if (isNaN(indexNum) || indexNum < 0) {
				return NextResponse.json({ error: 'Invalid index parameter' }, { status: 400 })
			}
			
			// Optimize query - use findOne with skip for better performance
			const element = await collection.findOne({}, { skip: indexNum })
			if (!element) {
				return NextResponse.json({ error: 'Element not found at index' }, { status: 404 })
			}
			return NextResponse.json({ element }, { 
				status: 200,
				headers: CACHE_HEADERS
			})
		} else {
			// Return all users if no index specified
			const users = await collection.find({}).toArray()
			return NextResponse.json({ users }, { 
				status: 200,
				headers: CACHE_HEADERS
			})
		}
	} catch (e) {
		console.error('Error in get-data route:', e)
		return NextResponse.json({ error: e.message }, { status: 500 })
	}
}
