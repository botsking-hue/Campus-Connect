'use client'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  MessageCircle,
  Share2,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PostCard({ post, showCampus = true, showActions = true }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const categories = {
    events: { name: "🎉 Events", color: "bg-purple-100 text-purple-800" },
    jobs: { name: "💼 Jobs & Hustles", color: "bg-blue-100 text-blue-800" },
    marketplace: { name: "🛍️ Marketplace", color: "bg-green-100 text-green-800" },
    confessions: { name: "🙊 Confessions", color: "bg-orange-100 text-orange-800" },
    promotions: { name: "📢 Promotions", color: "bg-pink-100 text-pink-800" }
  }

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    
    // In real app, you'd make an API call here
    try {
      // await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert on error
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1)
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shareUrl = `${window.location.origin}/posts/${post.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <Link href={`/posts/${post.id}`}>
        <div className="p-6 cursor-pointer">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categories[post.category]?.color}`}>
                {categories[post.category]?.name}
              </span>
              {showCampus && (
                <span className="text-sm text-gray-500">{post.campus}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(post.created_at)}
            </span>
          </div>
          
          {/* Title and Content */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 hover:text-blue-600 transition">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {post.content}
          </p>
          
          {/* Details */}
          <div className="space-y-2 mb-4">
            {post.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate">{post.location}</span>
              </div>
            )}
            {post.event_date && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-2 flex-shrink-0" />
                <span>{post.event_date}</span>
              </div>
            )}
            {post.price && (
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign size={14} className="mr-2 flex-shrink-0" />
                <span>{post.price}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-2 flex-shrink-0" />
              <span>{post.first_name || 'Anonymous'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className={`px-2 py-1 text-xs rounded-full ${
                post.status === 'approved' ? 'bg-green-100 text-green-800' :
                post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {post.status}
              </span>
            </div>

            {showActions && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 text-sm transition ${
                    isLiked ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                  <span>{likeCount}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-blue-600 transition"
                >
                  <Share2 size={16} />
                </button>
                
                <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-green-600 transition">
                  <MessageCircle size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// Props validation
PostCard.defaultProps = {
  showCampus: true,
  showActions: true
}
