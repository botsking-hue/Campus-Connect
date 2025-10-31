import { NextResponse } from 'next/server'
import sql from '../../../lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const limit = searchParams.get('limit') || 20

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('Fetching notifications for user:', user_id)

    // In a real app, you'd have a notifications table
    // For now, we'll return mock notifications based on user activity
    const mockNotifications = [
      {
        id: 1,
        type: 'post_approved',
        title: 'Post Approved',
        message: 'Your post "Campus Event This Weekend" has been approved and is now live.',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        type: 'new_follower',
        title: 'New Follower',
        message: 'John Doe started following your posts.',
        read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json(mockNotifications)

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, type, title, message } = body

    if (!user_id || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Creating notification:', { user_id, type, title })

    // In a real app, insert into notifications table
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Notification created successfully' 
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { notification_id, read } = body

    if (!notification_id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    console.log('Updating notification:', { notification_id, read })

    // In a real app, update notification in database
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Notification updated successfully' 
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
