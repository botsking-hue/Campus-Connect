import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const campus = searchParams.get('campus')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit') || 20

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    console.log('Searching with params:', { query, campus, category, limit })

    let whereConditions = []
    let queryParams = []

    let searchQuery = `
      SELECT p.*, u.first_name, u.username 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.user_id 
      WHERE (p.title ILIKE $1 OR p.content ILIKE $1)
        AND p.status = 'approved'
    `
    queryParams.push(`%${query}%`)

    if (campus && campus !== 'all') {
      whereConditions.push(`p.campus = $${whereConditions.length + 2}`)
      queryParams.push(campus)
    }
    
    if (category) {
      whereConditions.push(`p.category = $${whereConditions.length + 2}`)
      queryParams.push(category)
    }

    if (whereConditions.length > 0) {
      searchQuery += ` AND ${whereConditions.join(' AND ')}`
    }

    searchQuery += ` ORDER BY p.created_at DESC LIMIT $${whereConditions.length + 2}`
    queryParams.push(parseInt(limit))

    const results = await sql.unsafe(searchQuery, queryParams)
    console.log(`Found ${results.length} search results`)

    return NextResponse.json(results || [])

  } catch (error) {
    console.error('Error searching posts:', error)
    return NextResponse.json([], { status: 200 })
  }
}
