"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Phone, MapPin, Clock, Globe, Send } from "lucide-react"

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl my-8 relative">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Close contact form"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p className="text-green-50">Get in touch with our team</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Contact Info */}
          <div className="bg-gradient-to-b from-green-50 to-emerald-50 p-6 md:w-2/5 space-y-6 overflow-y-auto max-h-[70vh] md:max-h-none">
            <p className="text-gray-700 mb-8">
              Ready to start your next order? Our team is here to help you with quotes, product information, and any
              questions you may have.
            </p>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <Mail size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email Us</h3>
                <a href="mailto:contact@euronegocetrade.com" className="text-green-700 hover:underline">
                  contact@euronegocetrade.com
                </a>
                <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <Phone size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                <a href="tel:+49151457505077" className="text-green-700 hover:underline">
                  +49 151 45750507
                </a>
                <p className="text-sm text-gray-500 mt-1">Direct messaging for quick responses</p>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <MapPin size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Office</h3>
                <p className="text-gray-700">Paris, France</p>
                <p className="text-sm text-gray-500 mt-1">European operations center</p>
              </div>
            </div>

            {/* Headquarters */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <MapPin size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Headquarters</h3>
                <p className="text-gray-700">Courneuve, France</p>
                <p className="text-sm text-gray-500 mt-1">Main headquarters</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <Clock size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Business Hours</h3>
                <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                <p className="text-sm text-gray-500 mt-1">Emergency support available 24/7</p>
              </div>
            </div>

            {/* Global Reach */}
            <div className="flex items-start gap-4">
              <div className="bg-green-200/60 p-3 rounded-full mt-1 flex-shrink-0">
                <Globe size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Global Reach</h3>
                <p className="text-gray-700">Serving 25+ countries worldwide</p>
                <p className="text-sm text-gray-500 mt-1">Europe, MENA, Asia, Americas</p>
              </div>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="p-6 md:w-3/5 overflow-y-auto max-h-[70vh] md:max-h-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({ name: "", email: "", message: "" })
                  }}
                  className="mt-6 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-none"
                    placeholder="Tell us about your requirements, questions, or how we can help you..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  All messages are sent to{" "}
                  <a href="mailto:contact@euronegocetrade.com" className="text-green-700 hover:underline">
                    contact@euronegocetrade.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
