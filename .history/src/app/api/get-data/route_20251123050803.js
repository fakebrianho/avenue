import { NextResponse } from 'next/server'
import { find } from '@/lib/dbHelpers'
import { getDb } from '@/lib/mongodb'

export async function GET() {
	try {
		const db = await getDb()
		const collection = db.collection('user_collection')
		const users = await collection.find({}).toArray()
		return NextResponse.json({ users }, { status: 200 })
	} catch (e) {
		console.log('errroror,', e)
		return NextResponse.json({ error: e.message }, { status: 500 })
	}
}
