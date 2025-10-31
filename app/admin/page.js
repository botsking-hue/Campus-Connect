'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, Building, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [pendingPosts, setPendingPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // In real app, you'd get user_id from authentication
      const user_id = process.env.NEXT_PUBLIC_MAIN_ADMIN_ID
      
      const [statsRes, postsRes] = await Promise.all([
        fetch(`/api/admin?user_id=${user_id}`),
        fetch('/api/posts?status=pending&limit=50')
      ])
      
      const statsData = await statsRes.json()
      const postsData = await postsRes.json()
      
      setStats(statsData.stats || {})
      setPendingPosts(postsData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostAction = async (postId, action) => {
    try {
      const user_id = process.env.NEXT_PUBLIC_MAIN_ADMIN_ID
      
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, action, post_id: postId })
      })
      
      // Refresh data
      fetchAdminData()
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_users || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_posts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_posts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campuses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_campuses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Posts Review</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.campus}</span>
                      <span className="text-sm text-gray-500">by {post.first_name || 'Anonymous'}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {post.location && (
                        <span>📍 {post.location}</span>
                      )}
                      {post.event_date && (
                        <span>📅 {post.event_date}</span>
                      )}
                      {post.price && (
                        <span>💰 {post.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex space-x-2">
                    <button
                      onClick={() => handlePostAction(post.id, 'approve')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handlePostAction(post.id, 'reject')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {pendingPosts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <p className="text-gray-500">No pending posts to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
