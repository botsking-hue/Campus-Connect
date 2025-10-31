'use client'
import { useState, useEffect } from 'react'
import { ChevronDown, Check, MapPin } from 'lucide-react'

export default function CampusSelector({ 
  value, 
  onChange, 
  includeAllOption = true,
  label = "Select Campus",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCampus, setSelectedCampus] = useState(value || '')

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

  useEffect(() => {
    if (value !== undefined) {
      setSelectedCampus(value)
    }
  }, [value])

  const handleSelect = (campus) => {
    setSelectedCampus(campus)
    onChange(campus)
    setIsOpen(false)
  }

  const displayValue = selectedCampus === 'all' ? 'All Campuses' : 
                      selectedCampus || 'Select campus...'

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between text-left hover:border-gray-400 transition"
      >
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-gray-400" />
          <span className={selectedCampus ? 'text-gray-900' : 'text-gray-500'}>
            {displayValue}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            {/* All Campuses Option */}
            {includeAllOption && (
              <button
                onClick={() => handleSelect('all')}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition ${
                  selectedCampus === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span>All Campuses</span>
                {selectedCampus === 'all' && <Check size={16} className="text-blue-600" />}
              </button>
            )}

            {/* Campus Options */}
            {campuses.map((campus, index) => (
              <button
                key={index}
                onClick={() => handleSelect(campus)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition ${
                  selectedCampus === campus ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span>{campus}</span>
                {selectedCampus === campus && <Check size={16} className="text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Alternative Simple Select Version
export function CampusSelect({ value, onChange, includeAllOption = true, ...props }) {
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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      {...props}
    >
      <option value="">Select campus...</option>
      {includeAllOption && <option value="all">All Campuses</option>}
      {campuses.map((campus, index) => (
        <option key={index} value={campus}>{campus}</option>
      ))}
    </select>
  )
}
