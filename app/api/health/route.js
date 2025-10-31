import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET() {
  try {
    // Test database connection
    const [result] = await sql`SELECT 1 as test`
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      error: error.message
    }, { status: 503 })
  }
}
