"use client"

import { useState } from "react"
import { X, MapPin, Calendar, Award, Info, Leaf, Clock, Thermometer } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  image: string
  description: string
  origin: string
  season: string
  certifications: string[]
  detailedDescription: string
  nutritionalInfo: {
    calories: string
    protein: string
    carbs: string
    fiber: string
    vitamins: string[]
  }
  shelfLife: string
  storageConditions: string
  harvestMethod: string
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!isOpen || !product) return null

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "nutrition", label: "Nutrition", icon: Leaf },
    { id: "storage", label: "Storage", icon: Thermometer },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 sm:h-64 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(product.name)}`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            aria-label="Close product details"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h2>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
                <span key={cert} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Info */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Origin</p>
                  <p className="font-semibold">{product.origin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Season</p>
                  <p className="font-semibold">{product.season}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold capitalize">{product.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-green-600 text-green-600 bg-green-50"
                        : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.detailedDescription}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Harvest Method</h3>
                  <p className="text-gray-700">{product.harvestMethod}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quality Certifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Award size={16} className="text-green-600" />
                        <span className="font-medium text-green-800">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Nutritional Information (per 100g)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Calories</p>
                      <p className="text-xl font-bold text-blue-800">{product.nutritionalInfo.calories}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Protein</p>
                      <p className="text-xl font-bold text-green-800">{product.nutritionalInfo.protein}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Carbohydrates</p>
                      <p className="text-xl font-bold text-orange-800">{product.nutritionalInfo.carbs}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Fiber</p>
                      <p className="text-xl font-bold text-purple-800">{product.nutritionalInfo.fiber}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Vitamins & Minerals</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.nutritionalInfo.vitamins.map((vitamin) => (
                      <span
                        key={vitamin}
                        className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {vitamin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "storage" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock size={20} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">Shelf Life</h3>
                    </div>
                    <p className="text-blue-700">{product.shelfLife}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Thermometer size={20} className="text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">Storage Conditions</h3>
                    </div>
                    <p className="text-green-700">{product.storageConditions}</p>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Storage Tips</h3>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Keep away from direct sunlight</li>
                    <li>• Maintain proper ventilation</li>
                    <li>• Check regularly for quality</li>
                    <li>• Follow temperature guidelines</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Trigger contact modal
                onClose()
                window.dispatchEvent(new CustomEvent("openContactModal"))
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
