import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const campus = searchParams.get('campus')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || 20

    let query = sql`
      SELECT p.*, u.first_name, u.username 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.user_id 
      WHERE 1=1
    `
    
    if (campus && campus !== 'all') {
      query = query.append(sql` AND p.campus = ${campus}`)
    }
    
    if (category) {
      query = query.append(sql` AND p.category = ${category}`)
    }
    
    if (status) {
      query = query.append(sql` AND p.status = ${status}`)
    }
    
    query = query.append(sql` ORDER BY p.created_at DESC LIMIT ${parseInt(limit)}`)
    
    const posts = await query

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, campus, category, content, title, location, price, event_date } = body

    const [post] = await sql`
      INSERT INTO posts (user_id, campus, category, title, content, location, price, event_date, status)
      VALUES (${user_id}, ${campus}, ${category}, ${title}, ${content}, ${location}, ${price}, ${event_date}, 'pending')
      RETURNING *
    `

    return NextResponse.json({ success: true, post, message: 'Post created successfully' })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
