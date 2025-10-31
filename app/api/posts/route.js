import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const campus = searchParams.get('campus')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || 20
    const user_id = searchParams.get('user_id')

    console.log('Fetching posts with params:', { campus, category, status, limit, user_id })

    // Build query safely
    let whereConditions = []
    let queryParams = []

    let query = `
      SELECT p.*, u.first_name, u.username 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.user_id 
      WHERE 1=1
    `

    if (campus && campus !== 'all') {
      whereConditions.push(`p.campus = $${whereConditions.length + 1}`)
      queryParams.push(campus)
    }
    
    if (category) {
      whereConditions.push(`p.category = $${whereConditions.length + 1}`)
      queryParams.push(category)
    }
    
    if (status) {
      whereConditions.push(`p.status = $${whereConditions.length + 1}`)
      queryParams.push(status)
    }

    if (user_id) {
      whereConditions.push(`p.user_id = $${whereConditions.length + 1}`)
      queryParams.push(parseInt(user_id))
    }

    if (whereConditions.length > 0) {
      query += ` AND ${whereConditions.join(' AND ')}`
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${whereConditions.length + 1}`
    queryParams.push(parseInt(limit))

    console.log('Final query:', query)
    console.log('Query params:', queryParams)

    // Use unsafe for parameterized queries
    const posts = await sql.unsafe(query, queryParams)
    console.log(`Found ${posts.length} posts`)

    // Always return an array, even if empty
    return NextResponse.json(posts || [])

  } catch (error) {
    console.error('Database error fetching posts:', error)
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, campus, category, content, title, location, price, event_date } = body

    console.log('Creating post with data:', { user_id, campus, category })

    const [post] = await sql`
      INSERT INTO posts (user_id, campus, category, title, content, location, price, event_date, status)
      VALUES (${user_id}, ${campus}, ${category}, ${title}, ${content}, ${location}, ${price}, ${event_date}, 'pending')
      RETURNING *
    `

    return NextResponse.json({ 
      success: true, 
      post, 
      message: 'Post created successfully' 
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
