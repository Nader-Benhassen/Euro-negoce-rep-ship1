"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ProductsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductsModal({ isOpen, onClose }: ProductsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const products = [
    {
      id: "oranges",
      name: "Premium Oranges",
      category: "fruits",
      image: "/placeholder.svg?height=200&width=300&text=Premium+Oranges",
      description: "Sweet Valencia oranges from Mediterranean groves",
      origin: "Spain, Italy, Greece, Egypt",
      season: "November - April",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.50-3.20/kg",
      minOrder: "1 ton",
    },
    {
      id: "olive-oil",
      name: "Extra Virgin Olive Oil",
      category: "oils",
      image: "/placeholder.svg?height=200&width=300&text=Olive+Oil",
      description: "Cold-pressed olive oil from century-old trees",
      origin: "Tunisia, Spain, Italy, Greece",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP", "BIO"],
      price: "€8.50-12.00/L",
      minOrder: "500L",
    },
    {
      id: "tomatoes",
      name: "Fresh Tomatoes",
      category: "vegetables",
      image: "/placeholder.svg?height=200&width=300&text=Fresh+Tomatoes",
      description: "Vine-ripened tomatoes with exceptional flavor",
      origin: "Tunisia, Spain, Italy, Netherlands",
      season: "May - October",
      certifications: ["Origin Control", "HACCP"],
      price: "€1.80-2.50/kg",
      minOrder: "500kg",
    },
    {
      id: "dates",
      name: "Premium Dates",
      category: "fruits",
      image: "/placeholder.svg?height=200&width=300&text=Premium+Dates",
      description: "Premium Medjool and Deglet Nour dates",
      origin: "Tunisia, Saudi Arabia",
      season: "September - December",
      certifications: ["Origin Control", "HACCP"],
      price: "€6.00-15.00/kg",
      minOrder: "100kg",
    },
  ]

  const categories = [
    { value: "all", label: "All Products", icon: "🌟" },
    { value: "fruits", label: "Fresh Fruits", icon: "🍎" },
    { value: "vegetables", label: "Vegetables", icon: "🥬" },
    { value: "oils", label: "Edible Oils", icon: "🫒" },
  ]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Our Products</h2>
            <p className="text-green-100 mt-1">Premium Mediterranean produce and oils</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close products"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Price Range:</span>
                      <span className="text-green-600 font-semibold">{product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Min Order:</span>
                      <span className="text-blue-600">{product.minOrder}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Origins:</span>
                      <span className="text-gray-600 ml-1">{product.origin}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Season:</span>
                      <span className="text-gray-600 ml-1">{product.season}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.certifications.map((cert) => (
                      <span key={cert} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
