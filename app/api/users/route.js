import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const campus = searchParams.get('campus')
    const limit = searchParams.get('limit') || 50

    console.log('Fetching users with:', { user_id, campus, limit })

    if (user_id) {
      // Get single user
      const [user] = await sql`
        SELECT * FROM users WHERE user_id = ${parseInt(user_id)}
      `
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      return NextResponse.json(user)
    }

    // Get multiple users
    let query = sql`
      SELECT * FROM users 
    `
    let queryParams = []
    let whereConditions = []

    if (campus && campus !== 'all') {
      whereConditions.push(`campus = $${whereConditions.length + 1}`)
      queryParams.push(campus)
    }

    if (whereConditions.length > 0) {
      query = sql`${query} WHERE ${sql.unsafe(whereConditions.join(' AND '), queryParams)}`
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT ${parseInt(limit)}`

    const users = await query
    console.log(`Found ${users.length} users`)

    return NextResponse.json(users)

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, username, first_name, last_name, campus, is_admin = false } = body

    console.log('Creating/updating user:', { user_id, username, first_name, campus })

    const [user] = await sql`
      INSERT INTO users (user_id, username, first_name, last_name, campus, is_admin) 
      VALUES (${user_id}, ${username}, ${first_name}, ${last_name}, ${campus}, ${is_admin})
      ON CONFLICT (user_id) DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        campus = EXCLUDED.campus,
        is_admin = EXCLUDED.is_admin
      RETURNING *
    `

    return NextResponse.json({ 
      success: true, 
      user, 
      message: 'User created/updated successfully' 
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
