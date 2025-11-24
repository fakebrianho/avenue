import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// Cache count for longer since it changes less frequently
const CACHE_HEADERS = {
	'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
	try {
		const db = await getDb()
		const collection = db.collection('memory')
		const count = await collection.countDocuments()
		return NextResponse.json({ count }, { 
			status: 200,
			headers: CACHE_HEADERS
		})
	} catch (e) {
		console.error('Error getting count:', e)
		return NextResponse.json({ error: e.message }, { status: 500 })
	}
}

