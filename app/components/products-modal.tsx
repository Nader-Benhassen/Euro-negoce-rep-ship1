"use client"

import { useState } from "react"
import { X } from "lucide-react"
import ContactModal from "./contact-modal"

interface ProductsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductsModal({ isOpen, onClose }: ProductsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<any>(null)

  const products = [
    // Oils
    {
      id: "olive-oil",
      name: "Extra Virgin Olive Oil",
      category: "oils",
      image: "/images/products/olive-oil.jpeg",
      description: "Cold-pressed olive oil from century-old Mediterranean trees",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP", "BIO"],
      price: "€8.50-12.00/L",
      minOrder: "500L",
    },
    {
      id: "rapeseed-oil",
      name: "Premium Rapeseed Oil",
      category: "oils",
      image: "/images/products/rapeseed-oil-field.jpeg",
      description: "High-quality rapeseed oil with excellent cooking properties",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP"],
      price: "€6.50-9.00/L",
      minOrder: "1000L",
    },
    // Fruits
    {
      id: "oranges",
      name: "Premium Oranges",
      category: "fruits",
      image: "/images/products/oranges.png",
      description: "Sweet and juicy oranges from Tunisian and Spanish groves",
      origin: "Tunisia, Spain, Italy, Greece, Egypt",
      season: "November - April",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.50-3.20/kg",
      minOrder: "1 ton",
    },
    {
      id: "apples",
      name: "Fresh Apples",
      category: "fruits",
      image: "/images/products/apples.avif",
      description: "Crisp and sweet apples from European orchards",
      origin: "France, Italy, Germany, Poland",
      season: "September - March",
      certifications: ["Origin Control", "HACCP"],
      price: "€1.80-2.50/kg",
      minOrder: "500kg",
    },
    {
      id: "pears",
      name: "Premium Pears",
      category: "fruits",
      image: "/images/products/pears.png",
      description: "Juicy and aromatic pears from European orchards",
      origin: "France, Italy, Belgium, Netherlands",
      season: "August - February",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.20-3.00/kg",
      minOrder: "500kg",
    },
    {
      id: "peaches",
      name: "Fresh Peaches",
      category: "fruits",
      image: "/images/products/peaches.png",
      description: "Sweet and juicy peaches from Mediterranean regions",
      origin: "Spain, Italy, Greece, France",
      season: "June - September",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.80-4.00/kg",
      minOrder: "300kg",
    },
    {
      id: "strawberries",
      name: "Fresh Strawberries",
      category: "fruits",
      image: "/images/products/strawberries.png",
      description: "Sweet and juicy strawberries from European farms",
      origin: "Spain, France, Italy, Morocco",
      season: "April - August",
      certifications: ["Origin Control", "HACCP"],
      price: "€4.50-6.00/kg",
      minOrder: "200kg",
    },
    {
      id: "dates",
      name: "Premium Dates",
      category: "fruits",
      image: "/images/products/dates.png",
      description: "Premium Medjool and Deglet Nour dates from finest groves",
      origin: "Tunisia, Saudi Arabia, Algeria",
      season: "September - December",
      certifications: ["Origin Control", "HACCP"],
      price: "€6.00-15.00/kg",
      minOrder: "100kg",
    },
    {
      id: "watermelon",
      name: "Watermelon Crimson Sweet",
      category: "fruits",
      image: "/images/products/watermelon.png",
      description: "Sweet and refreshing Crimson Sweet watermelons",
      origin: "Spain, Italy, Greece, Tunisia",
      season: "June - September",
      certifications: ["Origin Control", "HACCP"],
      price: "€0.80-1.20/kg",
      minOrder: "2 tons",
    },
    {
      id: "melon",
      name: "Premium Melons",
      category: "fruits",
      image: "/images/products/melon.jpeg",
      description: "Sweet and aromatic cantaloupe and honeydew melons",
      origin: "Spain, France, Italy, Tunisia",
      season: "June - October",
      certifications: ["Origin Control", "HACCP"],
      price: "€1.50-2.20/kg",
      minOrder: "1 ton",
    },
    {
      id: "pineapple",
      name: "Premium Pineapples",
      category: "fruits",
      image: "/images/products/pineapple.png",
      description: "Sweet and juicy pineapples with tropical flavor",
      origin: "Costa Rica, Philippines, Thailand, Ghana",
      season: "Year-round (peak: March - July)",
      certifications: ["Origin Control", "HACCP", "Global G.A.P."],
      price: "€2.50-3.50/piece",
      minOrder: "500 pieces",
    },
    {
      id: "dragon-fruit",
      name: "Dragon Fruit (Pitaya)",
      category: "fruits",
      image: "/images/products/dragon-fruit.avif",
      description: "Exotic dragon fruit with vibrant color and subtle sweetness",
      origin: "Vietnam, Thailand, Malaysia, Nicaragua",
      season: "May - November",
      certifications: ["Origin Control", "HACCP", "Organic"],
      price: "€8.00-12.00/kg",
      minOrder: "50kg",
    },
    // Vegetables
    {
      id: "artichoke",
      name: "Fresh Artichokes",
      category: "vegetables",
      image: "/images/products/artichoke.png",
      description: "Premium Mediterranean artichokes with tender hearts",
      origin: "Spain, Italy, France, Tunisia",
      season: "March - June",
      certifications: ["Origin Control", "HACCP"],
      price: "€3.50-5.00/kg",
      minOrder: "200kg",
    },
    {
      id: "baklouti-pepper",
      name: "Tunisian Baklouti Pepper",
      category: "vegetables",
      image: "/images/products/baklouti-pepper.png",
      description: "Traditional Tunisian hot peppers with unique flavor profile",
      origin: "Tunisia",
      season: "July - October",
      certifications: ["Origin Control", "HACCP"],
      price: "€4.00-6.00/kg",
      minOrder: "100kg",
    },
    {
      id: "bell-peppers",
      name: "Bell Peppers",
      category: "vegetables",
      image: "/images/products/bell-peppers.jpeg",
      description: "Colorful bell peppers with crisp texture",
      origin: "Spain, Netherlands, Tunisia",
      season: "June - September",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.20-3.50/kg",
      minOrder: "500kg",
    },
    {
      id: "garlic",
      name: "Fresh Garlic",
      category: "vegetables",
      image: "/images/products/garlic.png",
      description: "Premium quality garlic bulbs with intense flavor",
      origin: "Spain, France, Tunisia, Egypt",
      season: "June - August",
      certifications: ["Origin Control", "HACCP"],
      price: "€3.00-4.50/kg",
      minOrder: "300kg",
    },
    {
      id: "potatoes",
      name: "Premium Potatoes",
      category: "vegetables",
      image: "/images/products/potatoes.jpeg",
      description: "High-quality potatoes with versatile culinary applications",
      origin: "France, Germany, Netherlands, Poland",
      season: "Year-round (peak: August - October)",
      certifications: ["Origin Control", "HACCP", "Global G.A.P."],
      price: "€0.80-1.50/kg",
      minOrder: "5 tons",
    },
    // Legumes
    {
      id: "fava-beans",
      name: "Fresh Fava Beans",
      category: "legumes",
      image: "/images/products/fava-beans.png",
      description: "Premium fresh fava beans with creamy texture",
      origin: "Tunisia, Egypt, Spain, Italy",
      season: "March - June",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.50-3.80/kg",
      minOrder: "500kg",
    },
    {
      id: "chickpeas",
      name: "Premium Chickpeas",
      category: "legumes",
      image: "/images/products/chickpeas.webp",
      description: "High-quality dried chickpeas from Mediterranean regions",
      origin: "Tunisia, Turkey, Spain, Italy",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP"],
      price: "€1.80-2.50/kg",
      minOrder: "1 ton",
    },
    // Nuts
    {
      id: "peanuts",
      name: "Premium Peanuts",
      category: "nuts",
      image: "/images/products/peanuts.webp",
      description: "High-quality raw and roasted peanuts from Mediterranean regions",
      origin: "Spain, Italy, Greece, Tunisia",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP"],
      price: "€2.20-3.50/kg",
      minOrder: "500kg",
    },
    {
      id: "pistachios",
      name: "Premium Pistachios",
      category: "nuts",
      image: "/images/products/pistachios.png",
      description: "Premium quality pistachios with excellent taste and texture",
      origin: "Tunisia, Turkey, Iran",
      season: "September - November",
      certifications: ["Origin Control", "HACCP"],
      price: "€12.00-18.00/kg",
      minOrder: "100kg",
    },
    {
      id: "almonds",
      name: "Fresh Almonds",
      category: "nuts",
      image: "/images/products/almonds.png",
      description: "Sweet and crunchy almonds from Mediterranean orchards",
      origin: "Tunisia, Spain, Italy",
      season: "August - October",
      certifications: ["Origin Control", "HACCP"],
      price: "€8.00-12.00/kg",
      minOrder: "200kg",
    },
  ]

  const categories = [
    { value: "all", label: "All Products", icon: "🌟" },
    { value: "oils", label: "Edible Oils", icon: "🫒" },
    { value: "fruits", label: "Fresh Fruits", icon: "🍎" },
    { value: "vegetables", label: "Vegetables", icon: "🥬" },
    { value: "legumes", label: "Legumes", icon: "🫘" },
    { value: "nuts", label: "Nuts", icon: "🥜" },
  ]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const handleRequestQuote = (product: any) => {
    setSelectedProductForQuote(product)
    setShowContactModal(true)
  }

  if (!isOpen) return null

  return (
    <>
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(product.name)}`
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-3">{product.description}</p>

                    <div className="space-y-2 mb-4">
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

                    <button
                      onClick={() => handleRequestQuote(product)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setSelectedProductForQuote(null)
        }}
      />
    </>
  )
}
