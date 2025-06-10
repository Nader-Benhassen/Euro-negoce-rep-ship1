"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react"

interface ContactPageProps {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
}

export default function ContactPage({ isOpen, onClose, t }: ContactPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p className="text-green-100 mt-1">Get in touch with our team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-2 rounded-lg transition-colors"
            aria-label="Close Contact"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-5 gap-0 h-full">
            {/* Contact Information Side */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 flex flex-col justify-center md:col-span-2">
              <div className="max-w-md mx-auto w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
                <p className="text-gray-600 mb-8">
                  Ready to start your next order? Our team is here to help you with quotes, product information, and any
                  questions you may have.
                </p>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email Us</h4>
                      <a href="mailto:euronegoce.mail@gmail.com" className="text-green-600 hover:underline">
                        euronegoce.mail@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">WhatsApp</h4>
                      <a
                        href="https://wa.me/4915145750507"
                        className="text-green-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +49 151 45750507
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Direct messaging for quick responses</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Headquarters</h4>
                      <p className="text-gray-600">Paris, France</p>
                      <p className="text-sm text-gray-500 mt-1">European operations center</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                      <p className="text-sm text-gray-500 mt-1">Emergency support available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Global Reach</h4>
                      <p className="text-gray-600">Serving 25+ countries worldwide</p>
                      <p className="text-sm text-gray-500 mt-1">Europe, MENA, Asia, Americas</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4">Why Choose Euro Negoce?</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">100+</div>
                      <div className="text-sm text-gray-600">Happy Clients</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">1000+</div>
                      <div className="text-sm text-gray-600">Tons Exported</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">10+</div>
                      <div className="text-sm text-gray-600">Countries Served</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">99%</div>
                      <div className="text-sm text-gray-600">On-Time Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Side */}
            <div className="p-10 flex flex-col justify-center md:col-span-3">
              <div className="max-w-md mx-auto w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail size={32} className="text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                    <p className="text-gray-600 mb-6">Thank you for your message. We'll get back to you soon!</p>
                    <button onClick={() => setSubmitted(false)} className="text-green-600 hover:underline font-medium">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Tell us about your requirements, questions, or how we can help you..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-green-600 text-white py-4 px-6 text-base rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
