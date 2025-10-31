import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

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

export async function PUT(request) {
  try {
    const body = await request.json()
    const { user_id, campus, is_admin } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('Updating user:', { user_id, campus, is_admin })

    const updateFields = []
    const updateValues = []

    if (campus !== undefined) {
      updateFields.push(`campus = $${updateFields.length + 1}`)
      updateValues.push(campus)
    }

    if (is_admin !== undefined) {
      updateFields.push(`is_admin = $${updateFields.length + 1}`)
      updateValues.push(is_admin)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${updateFields.length + 1}
      RETURNING *
    `
    updateValues.push(parseInt(user_id))

    const [user] = await sql.unsafe(query, updateValues)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      user, 
      message: 'User updated successfully' 
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
