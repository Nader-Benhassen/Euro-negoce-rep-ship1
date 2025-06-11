"use client"

import type React from "react"
import { useState } from "react"
import { X, Send, CheckCircle } from "lucide-react"
import { sendQuoteRequest } from "../actions/send-email"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  preSelectedProduct?: any
}

export default function ContactModal({ isOpen, onClose, preSelectedProduct = null }: ContactModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(preSelectedProduct ? [preSelectedProduct] : [])

  const availableProducts = [
    { id: "olive-oil", name: "Extra Virgin Olive Oil", category: "oils", price: "€8.50-12.00/L" },
    { id: "rapeseed-oil", name: "Premium Rapeseed Oil", category: "oils", price: "€3.50-4.20/L" },
    { id: "oranges", name: "Premium Oranges", category: "fruits", price: "€2.50-3.20/kg" },
    { id: "apples", name: "Fresh Apples", category: "fruits", price: "€2.00-2.80/kg" },
    { id: "pears", name: "Premium Pears", category: "fruits", price: "€2.20-3.00/kg" },
    { id: "peaches", name: "Fresh Peaches", category: "fruits", price: "€2.80-3.60/kg" },
    { id: "strawberries", name: "Fresh Strawberries", category: "fruits", price: "€4.50-6.00/kg" },
    { id: "dates", name: "Premium Dates", category: "fruits", price: "€6.00-15.00/kg" },
    { id: "watermelon", name: "Watermelon Crimson Sweet", category: "fruits", price: "€1.20-1.80/kg" },
    { id: "melon", name: "Premium Melons", category: "fruits", price: "€1.80-2.50/kg" },
    { id: "pineapple", name: "Premium Pineapples", category: "fruits", price: "€2.50-3.50/kg" },
    { id: "dragon-fruit", name: "Dragon Fruit (Pitaya)", category: "fruits", price: "€8.00-12.00/kg" },
    { id: "artichoke", name: "Fresh Artichokes", category: "vegetables", price: "€3.50-4.50/kg" },
    { id: "baklouti-pepper", name: "Tunisian Baklouti Pepper", category: "vegetables", price: "€5.00-7.00/kg" },
    { id: "bell-peppers", name: "Bell Peppers", category: "vegetables", price: "€2.20-3.50/kg" },
    { id: "garlic", name: "Fresh Garlic", category: "vegetables", price: "€3.00-4.50/kg" },
    { id: "potatoes", name: "Premium Potatoes", category: "vegetables", price: "€0.80-1.20/kg" },
    { id: "fava-beans", name: "Fresh Fava Beans", category: "legumes", price: "€2.50-3.50/kg" },
    { id: "chickpeas", name: "Premium Chickpeas", category: "legumes", price: "€1.80-2.50/kg" },
    { id: "peanuts", name: "Premium Peanuts", category: "nuts", price: "€3.50-4.50/kg" },
    { id: "pistachios", name: "Premium Pistachios", category: "nuts", price: "€12.00-18.00/kg" },
    { id: "almonds", name: "Fresh Almonds", category: "nuts", price: "€6.00-8.50/kg" },
  ]

  const handleProductToggle = (product: any) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id)
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
    } else {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add selected products to form data
      const selectedProductsString = selectedProducts.map((p) => p.name).join(", ")
      formData.append("selectedProducts", selectedProductsString)

      const result = await sendQuoteRequest(formData)

      if (result.success) {
        setSubmitted(true)
        setSubmitMessage(result.message)
      }
    } catch (error) {
      console.error("Error sending quote request:", error)
      setSubmitMessage(
        "There was an error sending your quote request. Please try again or contact us directly at euronegoce.mail@gmail.com",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedProducts([])
    setSubmitted(false)
    setSubmitMessage("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Request a Quote</h2>
            <p className="text-green-100 mt-1">Get personalized pricing for your needs</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close quote request"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quote Request Sent!</h3>
              <p className="text-gray-600 mb-6">{submitMessage}</p>
              <p className="text-sm text-gray-500 mb-6">
                You can also reach us directly at: <br />
                <a href="mailto:contact@euronegocetrade.com" className="text-green-600 hover:underline">
                  contact@euronegocetrade.com
                </a>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Another Request
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Your company name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Selection</h3>

                {/* Selected Products Display */}
                {selectedProducts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Products:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((product) => (
                        <span
                          key={product.id}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {product.name}
                          <button
                            type="button"
                            onClick={() => handleProductToggle(product)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  {showProductSelector ? "Hide Product Selection" : "Select Products from Catalog"}
                </button>

                {/* Product Selector */}
                {showProductSelector && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {availableProducts.map((product) => {
                        const isSelected = selectedProducts.some((p) => p.id === product.id)
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductToggle(product)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "border-green-500 bg-green-50 text-green-800"
                                : "border-gray-200 bg-white hover:border-green-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">{product.name}</h5>
                                <p className="text-sm text-gray-600">{product.price}</p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  isSelected ? "bg-green-500 border-green-500" : "border-gray-300"
                                }`}
                              >
                                {isSelected && <CheckCircle size={16} className="text-white" />}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Products */}
                <div className="mt-4">
                  <label htmlFor="customProducts" className="block text-sm font-medium text-gray-700 mb-2">
                    Other Products (not listed above)
                  </label>
                  <input
                    type="text"
                    id="customProducts"
                    name="customProducts"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Organic Apples, Sunflower Oil, etc."
                  />
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Estimated Quantity *
                    </label>
                    <input
                      type="text"
                      id="totalQuantity"
                      name="totalQuantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 10 tons, 500 cases, 1000kg"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location *
                    </label>
                    <input
                      type="text"
                      id="deliveryLocation"
                      name="deliveryLocation"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="City, Country"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Delivery Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP (within 1 week)</option>
                      <option value="2weeks">Within 2 weeks</option>
                      <option value="1month">Within 1 month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements & Notes *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Please describe your specific requirements, quality standards, packaging preferences, certifications needed, or any other details..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Request...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Request Quote
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                All quote requests are sent to{" "}
                <a href="mailto:contact@euronegocetrade.com" className="text-green-600 hover:underline">
                  contact@euronegocetrade.com
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
