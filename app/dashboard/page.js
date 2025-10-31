'use client'
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Briefcase, 
  ShoppingCart, 
  Eye, 
  Megaphone, 
  PlusCircle,
  User,
  MapPin,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  const categories = {
    events: { name: "Events", icon: Calendar, color: "bg-purple-100 text-purple-600", count: 0 },
    jobs: { name: "Jobs & Hustles", icon: Briefcase, color: "bg-blue-100 text-blue-600", count: 0 },
    marketplace: { name: "Marketplace", icon: ShoppingCart, color: "bg-green-100 text-green-600", count: 0 },
    confessions: { name: "Confessions", icon: Eye, color: "bg-orange-100 text-orange-600", count: 0 },
    promotions: { name: "Promotions", icon: Megaphone, color: "bg-pink-100 text-pink-600", count: 0 }
  }

  useEffect(() => {
    // Simulate user data - in real app, get from authentication
    const mockUser = {
      id: 123456789,
      name: "John Doe",
      campus: "University of Nairobi (UoN)",
      joinDate: "2024-01-15",
      isAdmin: false
    }
    setUser(mockUser)
    fetchUserPosts(mockUser.id)
  }, [])

  const fetchUserPosts = async (userId) => {
    try {
      // Fetch posts by this user
      const response = await fetch(`/api/posts?user_id=${userId}`)
      const posts = await response.json()
      setUserPosts(posts)
      
      // Update category counts
      Object.keys(categories).forEach(category => {
        categories[category].count = posts.filter(post => post.category === category).length
      })
    } catch (error) {
      console.error('Error fetching user posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Link 
              href="/posts/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircle size={20} />
              Create Post
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-gray-600 text-sm">{user?.campus}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Member since {new Date(user?.joinDate).toLocaleDateString()}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('my-posts')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'my-posts' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📝 My Posts
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'activity' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🔔 Activity
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(categories).map(([key, category]) => {
                    const IconComponent = category.icon
                    return (
                      <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{category.name}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{category.count}</p>
                          </div>
                          <div className={`p-3 rounded-full ${category.color}`}>
                            <IconComponent size={24} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Total posts in this category</p>
                      </div>
                    )
                  })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    {userPosts.length > 0 ? (
                      <div className="space-y-4">
                        {userPosts.slice(0, 5).map((post) => (
                          <div key={post.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-full ${categories[post.category]?.color}`}>
                                {React.createElement(categories[post.category]?.icon, { size: 16 })}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{post.title}</h4>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                  <Clock size={14} />
                                  {new Date(post.created_at).toLocaleDateString()}
                                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                    {post.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <Link 
                              href={`/posts/${post.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PlusCircle size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No posts yet</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
                        <Link 
                          href="/posts/create"
                          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Create Post
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-posts' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
                  <span className="text-sm text-gray-500">{userPosts.length} total posts</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {userPosts.map((post) => (
                    <div key={post.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categories[post.category]?.color}`}>
                              {categories[post.category]?.name}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              post.status === 'approved' ? 'bg-green-100 text-green-800' :
                              post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {post.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {post.location}
                              </span>
                            )}
                            <span>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-6 flex space-x-2">
                          <Link 
                            href={`/posts/${post.id}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {userPosts.length === 0 && (
                  <div className="text-center py-12">
                    <PlusCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">You haven't created any posts yet</p>
                    <Link 
                      href="/posts/create"
                      className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Create Your First Post
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <div key={post.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                        <div className={`p-2 rounded-full ${categories[post.category]?.color}`}>
                          {React.createElement(categories[post.category]?.icon, { size: 20 })}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">
                            You created a new <span className="font-medium">{categories[post.category]?.name}</span> post
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'approved' ? 'bg-green-100 text-green-800' :
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  {userPosts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No activity yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
