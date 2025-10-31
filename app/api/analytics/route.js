import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d

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

    // Calculate date range based on period
    let days = 7
    if (period === '30d') days = 30
    if (period === '90d') days = 90

    // Get user growth data
    const userGrowth = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    // Get post growth data
    const postGrowth = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_posts,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_posts
      FROM posts 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `

    // Get campus distribution
    const campusDistribution = await sql`
      SELECT 
        campus,
        COUNT(*) as user_count
      FROM users 
      WHERE campus IS NOT NULL
      GROUP BY campus
      ORDER BY user_count DESC
    `

    // Get category distribution
    const categoryDistribution = await sql`
      SELECT 
        category,
        COUNT(*) as post_count
      FROM posts 
      WHERE status = 'approved'
      GROUP BY category
      ORDER BY post_count DESC
    `

    return NextResponse.json({
      userGrowth: userGrowth || [],
      postGrowth: postGrowth || [],
      campusDistribution: campusDistribution || [],
      categoryDistribution: categoryDistribution || []
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({
      userGrowth: [],
      postGrowth: [],
      campusDistribution: [],
      categoryDistribution: []
    }, { status: 200 })
  }
}
