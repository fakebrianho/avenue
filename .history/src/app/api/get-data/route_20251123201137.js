import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

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
			
			const element = await collection.find({}).skip(indexNum).limit(1).toArray()
			if (element.length === 0) {
				return NextResponse.json({ error: 'Element not found at index' }, { status: 404 })
			}
			return NextResponse.json({ element: element[0] }, { status: 200 })
		} else {
			// Return all users if no index specified
			const users = await collection.find({}).toArray()
			return NextResponse.json({ users }, { status: 200 })
		}
	} catch (e) {
		console.log('errroror,', e)
		return NextResponse.json({ error: e.message }, { status: 500 })
	}
}
