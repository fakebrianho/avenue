import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
	try {
		const db = await getDb()
		const collection = db.collection('movies')
		const count = await collection.countDocuments()
		return NextResponse.json({ count }, { status: 200 })
	} catch (e) {
		console.log('error getting count:', e)
		return NextResponse.json({ error: e.message }, { status: 500 })
	}
}

