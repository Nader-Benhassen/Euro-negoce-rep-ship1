"use client"

import type React from "react"

import { useState } from "react"
import { X, Phone, CheckCircle, Send, Clock } from "lucide-react"

interface AppointmentSchedulerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentScheduler({ isOpen, onClose }: AppointmentSchedulerProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    timezone: "CET",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }
    return dates
  }

  // Generate available time slots - Extended to 7 PM
  const getAvailableTimeSlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 19 // Changed from 17 to 19 (7 PM)

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const availableDates = getAvailableDates()
  const availableTimeSlots = getAvailableTimeSlots()

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Don't automatically advance to step 2, let user see time options immediately
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep(3) // Go directly to step 3 after time selection
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate sending emails
    console.log("Sending call appointment emails...")
    console.log("Client email:", {
      to: formData.email,
      subject: "Call Scheduled with Euro Negoce",
      appointmentDetails: {
        date: selectedDate?.toLocaleDateString(),
        time: selectedTime,
        timezone: formData.timezone,
        type: "Phone Call",
      },
    })

    console.log("Company email:", {
      to: "euronegoce.mail@gmail.com",
      subject: "New Call Appointment Scheduled",
      clientDetails: formData,
      appointmentDetails: {
        date: selectedDate?.toLocaleDateString(),
        time: selectedTime,
        timezone: formData.timezone,
      },
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSelectedDate(null)
    setSelectedTime("")
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      timezone: "CET",
    })
    setIsSubmitted(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour24 = Number.parseInt(hours)
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? "PM" : "AM"
    return `${hour12}:${minutes} ${ampm}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Schedule a Call</h2>
              <p className="text-green-100 mt-1">Book a phone consultation with our team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close scheduler"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-8 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && <div className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className="text-center">
              {currentStep === 1 && "Select Date & Time"}
              {currentStep === 2 && "Choose Time"}
              {currentStep === 3 && "Your Details"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isSubmitted ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Call Scheduled!</h3>
              <div className="bg-green-50 rounded-lg p-6 mb-6 max-w-md mx-auto border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  Call Details:
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Date:</span> {selectedDate && formatDate(selectedDate)}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {formatTime(selectedTime)} ({formData.timezone})
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> Phone Consultation
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> 30 minutes
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Confirmation emails have been sent to both you and our team. We'll call you at the scheduled time using
                the phone number you provided.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Schedule Another Call
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
            <>
              {/* Step 1: Date & Time Selection Combined */}
              {currentStep === 1 && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Select a Date</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {availableDates.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          className={`p-3 border rounded-lg transition-all duration-200 text-center group ${
                            selectedDate && selectedDate.toDateString() === date.toDateString()
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-green-500 hover:bg-green-50"
                          }`}
                        >
                          <div className="text-xs text-gray-600 group-hover:text-green-600">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </div>
                          <div className="text-lg font-semibold text-gray-800 group-hover:text-green-700">
                            {date.getDate()}
                          </div>
                          <div className="text-xs text-gray-600 group-hover:text-green-600">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection - Always Visible */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                      {selectedDate ? `Available Times for ${formatDate(selectedDate)}` : "Select a Date First"}
                    </h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`p-3 border rounded-lg transition-all duration-200 text-center font-medium ${
                              selectedTime === time
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-25"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <Clock size={14} className={selectedTime === time ? "text-green-500" : "text-gray-500"} />
                              <span className="font-medium">{formatTime(time)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        <div className="text-center">
                          <Clock size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Please select a date to see available times</p>
                        </div>
                      </div>
                    )}
                    {selectedDate && (
                      <p className="text-sm text-gray-500 text-center mt-4">
                        All times are in Central European Time (CET) • Available 9:00 AM - 7:00 PM
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {currentStep === 3 && (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Details</h3>
                    <div className="bg-green-50 rounded-lg p-4 inline-block border border-green-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Date:</span> {selectedDate && formatDate(selectedDate)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Time:</span> {formatTime(selectedTime)} CET
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center mt-2">
                      <button onClick={() => setCurrentStep(1)} className="text-green-600 hover:underline text-sm">
                        Change Date & Time
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
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
                          value={formData.email}
                          onChange={handleInputChange}
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
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Your company"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">We'll call you at this number</p>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Timezone
                        </label>
                        <select
                          id="timezone"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="CET">Central European Time (CET)</option>
                          <option value="GMT">Greenwich Mean Time (GMT)</option>
                          <option value="EST">Eastern Standard Time (EST)</option>
                          <option value="PST">Pacific Standard Time (PST)</option>
                          <option value="GST">Gulf Standard Time (GST)</option>
                          <option value="JST">Japan Standard Time (JST)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Call Agenda / Topics to Discuss
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Please describe what you'd like to discuss during our call (products of interest, business requirements, partnership opportunities, etc.)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Scheduling Call...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Schedule Call
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
