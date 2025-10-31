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
    const post_id = searchParams.get('id')

    console.log('Fetching posts with params:', { campus, category, status, limit, user_id, post_id })

    // If specific post ID is requested
    if (post_id) {
      const [post] = await sql`
        SELECT p.*, u.first_name, u.username 
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.user_id 
        WHERE p.id = ${parseInt(post_id)}
      `
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      
      return NextResponse.json(post)
    }

    // Build query for multiple posts
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

    const posts = await sql.unsafe(query, queryParams)
    console.log(`Found ${posts.length} posts`)

    return NextResponse.json(posts || [])

  } catch (error) {
    console.error('Database error fetching posts:', error)
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

export async function PUT(request) {
  try {
    const body = await request.json()
    const { post_id, status, admin_notes } = body

    console.log('Updating post:', { post_id, status })

    const [post] = await sql`
      UPDATE posts 
      SET status = ${status}, 
          approved_at = ${status === 'approved' ? sql`NOW()` : sql`NULL`},
          admin_notes = ${admin_notes}
      WHERE id = ${post_id}
      RETURNING *
    `

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      post, 
      message: 'Post updated successfully' 
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('id')

    if (!post_id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    console.log('Deleting post:', post_id)

    const result = await sql`
      DELETE FROM posts WHERE id = ${parseInt(post_id)}
    `

    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
