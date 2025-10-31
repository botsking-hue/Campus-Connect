import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is admin
    const [user] = await sql`
      SELECT is_admin FROM users WHERE user_id = ${user_id}
    `

    if (!user?.is_admin && user_id !== process.env.MAIN_ADMIN_ID) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get admin stats
    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_users,
        (SELECT COUNT(*) FROM posts) as total_posts,
        (SELECT COUNT(*) FROM posts WHERE status = 'pending') as pending_posts,
        COUNT(DISTINCT campus) as active_campuses
      FROM users
      WHERE campus IS NOT NULL
    `

    // Get posts by category
    const categories = await sql`
      SELECT category, COUNT(*) as count 
      FROM posts 
      GROUP BY category
    `

    return NextResponse.json({ stats, categories })
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, action, post_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is admin
    const [user] = await sql`
      SELECT is_admin FROM users WHERE user_id = ${user_id}
    `

    if (!user?.is_admin && user_id !== process.env.MAIN_ADMIN_ID) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    if (action === 'approve') {
      await sql`
        UPDATE posts 
        SET status = 'approved', approved_at = NOW() 
        WHERE id = ${post_id}
      `
      return NextResponse.json({ success: true, message: 'Post approved' })
    } else if (action === 'reject') {
      await sql`
        DELETE FROM posts WHERE id = ${post_id}
      `
      return NextResponse.json({ success: true, message: 'Post rejected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin action:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
