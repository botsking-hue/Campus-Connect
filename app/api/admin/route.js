import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export const dynamic = 'force-dynamic'

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
        (SELECT COUNT(*) FROM posts WHERE status = 'approved') as approved_posts,
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

    // Get recent users
    const recentUsers = await sql`
      SELECT user_id, first_name, username, campus, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({ 
      stats, 
      categories: categories || [],
      recentUsers: recentUsers || []
    })

  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json({ 
      stats: {
        total_users: 0,
        total_posts: 0,
        pending_posts: 0,
        approved_posts: 0,
        active_campuses: 0
      },
      categories: [],
      recentUsers: []
    }, { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, action, post_id, target_user_id } = body

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

    // Handle different admin actions
    if (action === 'approve') {
      await sql`
        UPDATE posts 
        SET status = 'approved', approved_at = NOW() 
        WHERE id = ${post_id}
      `
      return NextResponse.json({ success: true, message: 'Post approved' })
    } 
    else if (action === 'reject') {
      await sql`
        DELETE FROM posts WHERE id = ${post_id}
      `
      return NextResponse.json({ success: true, message: 'Post rejected' })
    }
    else if (action === 'make_admin') {
      await sql`
        UPDATE users SET is_admin = TRUE WHERE user_id = ${target_user_id}
      `
      return NextResponse.json({ success: true, message: 'User promoted to admin' })
    }
    else if (action === 'remove_admin') {
      await sql`
        UPDATE users SET is_admin = FALSE WHERE user_id = ${target_user_id}
      `
      return NextResponse.json({ success: true, message: 'Admin privileges removed' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error in admin action:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
