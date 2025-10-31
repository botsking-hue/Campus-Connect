'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Briefcase, 
  ShoppingCart, 
  Eye, 
  Megaphone,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function CreatePost() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    location: '',
    price: '',
    event_date: '',
    campus: ''
  })
  const [loading, setLoading] = useState(false)

  const campuses = [
    "University of Nairobi (UoN)",
    "Kenyatta University (KU)", 
    "Jomo Kenyatta University (JKUAT)",
    "Moi University",
    "Egerton University",
    "Maseno University",
    "Technical University of Kenya",
    "Technical University of Mombasa",
    "Mount Kenya University (MKU)",
    "KCA University",
    "Strathmore University",
    "United States International University (USIU)",
    "Other University"
  ]

  const categories = {
    events: { 
      name: "Events", 
      icon: Calendar, 
      color: "bg-purple-100 text-purple-600 border-purple-200",
      description: "Parties, meetings, campus events, workshops"
    },
    jobs: { 
      name: "Jobs & Hustles", 
      icon: Briefcase, 
      color: "bg-blue-100 text-blue-600 border-blue-200",
      description: "Part-time work, internships, freelance gigs"
    },
    marketplace: { 
      name: "Marketplace", 
      icon: ShoppingCart, 
      color: "bg-green-100 text-green-600 border-green-200",
      description: "Buy/sell items, digital goods, textbooks"
    },
    confessions: { 
      name: "Confessions", 
      icon: Eye, 
      color: "bg-orange-100 text-orange-600 border-orange-200",
      description: "Share anonymous thoughts and secrets"
    },
    promotions: { 
      name: "Promotions", 
      icon: Megaphone, 
      color: "bg-pink-100 text-pink-600 border-pink-200",
      description: "Business ads, club promotions, services"
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category,
      title: prev.title || `${categories[category].name} Post`
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In real app, get user_id from authentication
      const user_id = 123456789 // Mock user ID

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id,
          campus: formData.campus || campuses[0] // Default to first campus
        })
      })

      const result = await response.json()

      if (result.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Error creating post: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600">Share something with your campus community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categories).map(([key, category]) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCategorySelect(key)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.category === key 
                          ? `${category.color} border-current transform scale-105` 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <IconComponent size={20} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {formData.category && (
              <>
                {/* Post Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Post Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campus Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campus *
                      </label>
                      <select
                        name="campus"
                        value={formData.campus}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your campus</option>
                        {campuses.map((campus, index) => (
                          <option key={index} value={campus}>{campus}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter a clear title for your post"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Describe your post in detail. Include all relevant information..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Main Campus, Online"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., Free, KES 500"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Event Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleInputChange}
                        placeholder="e.g., March 15, 2024"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Post...' : 'Create Post'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
