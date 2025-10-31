import { useState, useEffect } from 'react';
import Head from 'next/head';
import { MapPin, Calendar, DollarSign, User } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  const campuses = [
    "University of Nairobi (UoN)",
    "Kenyatta University (KU)",
    "Jomo Kenyatta University (JKUAT)",
    "Moi University",
    "Egerton University"
  ];

  const categories = {
    events: { name: "🎉 Events", color: "bg-purple-100 text-purple-800" },
    jobs: { name: "💼 Jobs & Hustles", color: "bg-blue-100 text-blue-800" },
    marketplace: { name: "🛍️ Marketplace", color: "bg-green-100 text-green-800" },
    confessions: { name: "🙊 Confessions", color: "bg-orange-100 text-orange-800" },
    promotions: { name: "📢 Promotions", color: "bg-pink-100 text-pink-800" }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCampus, selectedCategory]);

  const fetchPosts = async () => {
    const params = new URLSearchParams();
    if (selectedCampus !== 'all') params.append('campus', selectedCampus);
    if (selectedCategory) params.append('category', selectedCategory);
    
    const response = await fetch(`/api/posts?${params}`);
    const data = await response.json();
    setPosts(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Campus Connect - Student Community</title>
        <meta name="description" content="Connect with students across Kenyan universities" />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Campus Connect</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your digital student union connecting Kenyan universities
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Get Started
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
              <select 
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Campuses</option>
                {campuses.map((campus, index) => (
                  <option key={index} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {Object.entries(categories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categories[post.category]?.color}`}>
                    {categories[post.category]?.name}
                  </span>
                  <span className="text-sm text-gray-500">{post.campus}</span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                
                <div className="space-y-2">
                  {post.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={16} className="mr-2" />
                      {post.location}
                    </div>
                  )}
                  {post.event_date && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {post.event_date}
                    </div>
                  )}
                  {post.price && (
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign size={16} className="mr-2" />
                      {post.price}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={16} className="mr-2" />
                    {post.first_name || 'Anonymous'}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No posts found</div>
            <p className="text-gray-500 mt-2">Be the first to post in your campus!</p>
          </div>
        )}
      </div>
    </div>
  );
}
