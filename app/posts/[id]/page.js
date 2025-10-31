'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Clock,
  ArrowLeft,
  MessageCircle,
  Share2
} from 'lucide-react'
import Link from 'next/link'

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  const categories = {
    events: { name: "🎉 Events", color: "bg-purple-100 text-purple-800" },
    jobs: { name: "💼 Jobs & Hustles", color: "bg-blue-100 text-blue-800" },
    marketplace: { name: "🛍️ Marketplace", color: "bg-green-100 text-green-800" },
    confessions: { name: "🙊 Confessions", color: "bg-orange-100 text-orange-800" },
    promotions: { name: "📢 Promotions", color: "bg-pink-100 text-pink-800" }
  }

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id)
      fetchRelatedPosts(params.id)
    }
  }, [params.id])

  const fetchPost = async (postId) => {
    try {
      // In a real app, you'd have an API endpoint for single post
      const response = await fetch('/api/posts')
      const posts = await response.json()
      const foundPost = posts.find(p => p.id === parseInt(postId))
      setPost(foundPost)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (postId) => {
    try {
      if (post) {
        const response = await fetch(`/api/posts?campus=${post.campus}&category=${post.category}&limit=4`)
        const posts = await response.json()
        setRelatedPosts(posts.filter(p => p.id !== parseInt(postId)).slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category]?.color}`}>
                  {categories[post.category]?.name}
                </span>
                <span className="text-sm text-gray-500">{post.campus}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-200">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{post.first_name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'approved' ? 'bg-green-100 text-green-800' :
                        post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Details */}
                <div className="p-6">
                  {/* Additional Info */}
                  {(post.location || post.event_date || post.price) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      {post.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2 flex-shrink-0" />
                          <span>{post.location}</span>
                        </div>
                      )}
                      {post.event_date && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2 flex-shrink-0" />
                          <span>{post.event_date}</span>
                        </div>
                      )}
                      {post.price && (
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign size={16} className="mr-2 flex-shrink-0" />
                          <span>{post.price}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <MessageCircle size={16} />
                        Contact Poster
                      </button>
                    </div>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Share2 size={16} />
                      Share Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Poster Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Posted By</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.first_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">{post.campus}</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/posts/${relatedPost.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories[relatedPost.category]?.color}`}>
                            {categories[relatedPost.category]?.name}
                          </span>
                        </div>
                        <p className="font-medium text-sm text-gray-900 line-clamp-2">
                          {relatedPost.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(relatedPost.created_at).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
