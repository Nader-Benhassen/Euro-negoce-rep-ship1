"use client"

import { useState } from "react"
import { X, Star, MapPin, Calendar, Award, Truck, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import ContactFormModal from "./contact-form-modal"
import AppointmentScheduler from "./appointment-scheduler"

interface Product {
  id: string
  name: string
  category: string
  image: string
  description: string
  origin: string
  season: string
  certifications: string[]
  detailedDescription?: string
  nutritionalInfo?: {
    calories?: string
    protein?: string
    carbs?: string
    fiber?: string
    vitamins?: string[]
  }
  shelfLife?: string
  storageConditions?: string
  harvestMethod?: string
  images?: string[]
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [showContactForm, setShowContactForm] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)

  if (!isOpen || !product) return null

  const productImages = product.images || [product.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <Star size={16} /> },
    { id: "specifications", label: "Specifications", icon: <Award size={16} /> },
    { id: "logistics", label: "Logistics", icon: <Truck size={16} /> },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 sm:py-6 px-4 sm:px-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">{product.name}</h2>
            <p className="text-green-100 mt-1 text-sm sm:text-base">
              Premium {product.category} from Mediterranean regions
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close product details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)] sm:h-[calc(90vh-120px)]">
          {/* Image Section */}
          <div className="lg:w-1/2 p-3 sm:p-6 bg-gray-50">
            <div className="relative h-full">
              <div className="relative h-64 sm:h-96 lg:h-full bg-white rounded-xl overflow-hidden shadow-lg">
                <img
                  src={productImages[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(product.name)}`
                  }}
                />

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>

                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                            index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <MapPin size={14} className="text-green-600" />
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">Origin</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{product.origin}</p>
                </div>
                <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Calendar size={14} className="text-blue-600" />
                    <span className="font-medium text-gray-800 text-xs sm:text-sm">Season</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{product.season}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all text-xs sm:text-sm ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Product Description</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {product.detailedDescription || product.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {product.nutritionalInfo && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        Nutritional Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                          {product.nutritionalInfo.calories && (
                            <div>
                              <span className="font-medium">Calories:</span> {product.nutritionalInfo.calories}
                            </div>
                          )}
                          {product.nutritionalInfo.protein && (
                            <div>
                              <span className="font-medium">Protein:</span> {product.nutritionalInfo.protein}
                            </div>
                          )}
                          {product.nutritionalInfo.carbs && (
                            <div>
                              <span className="font-medium">Carbs:</span> {product.nutritionalInfo.carbs}
                            </div>
                          )}
                          {product.nutritionalInfo.fiber && (
                            <div>
                              <span className="font-medium">Fiber:</span> {product.nutritionalInfo.fiber}
                            </div>
                          )}
                        </div>
                        {product.nutritionalInfo.vitamins && (
                          <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
                            <span className="font-medium">Rich in:</span> {product.nutritionalInfo.vitamins.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-4 sm:space-y-6">
                  {product.harvestMethod && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Harvest Method</h4>
                      <p className="text-sm sm:text-base text-gray-700">{product.harvestMethod}</p>
                    </div>
                  )}

                  {product.storageConditions && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        Storage Conditions
                      </h4>
                      <p className="text-sm sm:text-base text-gray-700">{product.storageConditions}</p>
                    </div>
                  )}

                  {product.shelfLife && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Shelf Life</h4>
                      <p className="text-sm sm:text-base text-gray-700">{product.shelfLife}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Quality Standards</h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Award className="text-green-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">Premium quality selection process</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Award className="text-blue-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">
                          Rigorous quality control at every stage
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Award className="text-purple-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">International certification compliance</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                      Shipping Information
                    </h4>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Truck className="text-gray-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">
                          Temperature-controlled transport available
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MapPin className="text-gray-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">Worldwide shipping to 10+ countries</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Award className="text-gray-600" size={16} />
                        <span className="text-gray-700 text-xs sm:text-sm">99% on-time delivery rate</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Lead Times</h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                      <p>• Europe: 2-5 business days</p>
                      <p>• MENA Region: 5-10 business days</p>
                      <p>• Other regions: Contact for details</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Custom Solutions</h4>
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-green-700 text-xs sm:text-sm">
                        We offer customized packaging, labeling, and delivery solutions to meet your specific business
                        requirements. Contact our sales team to discuss your unique needs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Mail size={16} />
                  Request Quote
                </button>
                <button
                  onClick={() => setShowScheduler(true)}
                  className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Phone size={16} />
                  Contact Sales
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-3">
                Get personalized pricing and availability information
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactFormModal
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          selectedProduct={product?.name}
        />

        {/* Appointment Scheduler Modal */}
        <AppointmentScheduler isOpen={showScheduler} onClose={() => setShowScheduler(false)} />
      </div>
    </div>
  )
}
