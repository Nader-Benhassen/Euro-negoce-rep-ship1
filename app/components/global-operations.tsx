"use client"

import { useState, useEffect } from "react"
import { Building2, Globe, Mail, Phone, Users, Award, TrendingUp, Shield, Clock, Star, CheckCircle } from "lucide-react"
import AppointmentScheduler from "./appointment-scheduler"
import ContactFormModal from "./contact-form-modal"

interface GlobalOperationsProps {
  t: (key: string) => string
}

export default function GlobalOperations({ t }: GlobalOperationsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [animatedStats, setAnimatedStats] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleContactClick = () => {
    setShowContactForm(true)
  }

  const handleScheduleCallClick = () => {
    setShowScheduler(true)
  }

  const locations = [
    {
      id: "courneuve",
      name: "La Courneuve",
      country: "France",
      type: "headquarters",
      role: "Global Headquarters",
      team: "25+ professionals",
      focus: "Strategic leadership and global coordination",
    },
    {
      id: "paris",
      name: "Paris",
      country: "France",
      type: "office",
      role: "Business Development",
      team: "15+ professionals",
      focus: "European market expansion and client relations",
    },
    {
      id: "munich",
      name: "Munich",
      country: "Germany",
      type: "office",
      role: "Logistics Hub",
      team: "12+ professionals",
      focus: "Supply chain and distribution management",
    },
    {
      id: "tunis",
      name: "Tunis",
      country: "Tunisia",
      type: "office",
      role: "Sourcing Center",
      team: "18+ professionals",
      focus: "Producer relations and quality control",
    },
  ]

  const capabilities = [
    {
      title: "Supply Chain Excellence",
      description: "End-to-end logistics with temperature-controlled transport",
      icon: <TrendingUp size={24} />,
      metrics: "99% on-time delivery",
    },
    {
      title: "Quality Assurance",
      description: "Multi-stage quality control and certification management",
      icon: <Shield size={24} />,
      metrics: "ISO certified processes",
    },
    {
      title: "Global Reach",
      description: "Serving 10+ countries across Europe and MENA",
      icon: <Globe size={24} />,
      metrics: "4 strategic locations",
    },
    {
      title: "Customer Support",
      description: "24/7 dedicated support and account management",
      icon: <Users size={24} />,
      metrics: "100+ satisfied clients",
    },
  ]

  const stats = [
    { number: "4", label: "Office Locations", icon: <Building2 size={20} /> },
    { number: "10+", label: "Countries Served", icon: <Globe size={20} /> },
    { number: "100+", label: "Happy Clients", icon: <Users size={20} /> },
    { number: "99%", label: "On-Time Delivery", icon: <Clock size={20} /> },
  ]

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Streamlined Header */}
        <div className="text-center mb-16">
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Strategic locations across Europe and MENA delivering excellence through local expertise and global
            coordination
          </p>
        </div>

        {/* Clean Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                animatedStats ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-300 text-sm font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="border-b border-white/10">
            <div className="flex flex-wrap">
              {[
                { id: "overview", label: "Overview", icon: <Globe size={18} /> },
                { id: "locations", label: "Locations", icon: <Building2 size={18} /> },
                { id: "capabilities", label: "Capabilities", icon: <Award size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white bg-white/10 border-b-2 border-blue-400"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-4">Excellence in International Trade</h4>
                  <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                    Euro Negoce operates through strategically positioned offices across Europe and MENA, ensuring
                    seamless coordination and local expertise for all international trade operations.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Star className="text-yellow-400" size={20} />
                      Our Mission
                    </h5>
                    <p className="text-slate-300">
                      To bridge continents with quality goods, providing exceptional Mediterranean products to global
                      markets through reliable partnerships and sustainable practices.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="text-blue-400" size={20} />
                      Our Commitment
                    </h5>
                    <p className="text-slate-300">
                      Delivering premium quality products with complete traceability, ensuring food safety standards and
                      maintaining long-term relationships with clients worldwide.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Locations Tab */}
            {activeTab === "locations" && (
              <div className="grid md:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          location.type === "headquarters"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h5 className="text-xl font-semibold text-white mb-1">
                          {location.name}
                          {location.type === "headquarters" && (
                            <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                              HQ
                            </span>
                          )}
                        </h5>
                        <p className="text-slate-400 text-sm">{location.country}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-medium">Role:</span>
                        <span className="text-slate-300">{location.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium">Team:</span>
                        <span className="text-slate-300">{location.team}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 font-medium">Focus:</span>
                        <span className="text-slate-300">{location.focus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Capabilities Tab */}
            {activeTab === "capabilities" && (
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((capability, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 text-blue-300 rounded-lg flex items-center justify-center">
                        {capability.icon}
                      </div>
                      <div>
                        <h5 className="text-xl font-semibold text-white mb-2">{capability.title}</h5>
                        <p className="text-slate-300 mb-3">{capability.description}</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 font-medium">{capability.metrics}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h4 className="text-2xl font-bold text-white mb-4">Ready to Partner with Us?</h4>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Contact our global team to discuss your international trade requirements and discover how we can support
              your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactClick}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 justify-center"
              >
                <Mail size={18} />
                Contact Us
              </button>
              <button
                onClick={handleScheduleCallClick}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 justify-center"
              >
                <Phone size={18} />
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={showContactForm} onClose={() => setShowContactForm(false)} />

      {/* Appointment Scheduler Modal */}
      <AppointmentScheduler isOpen={showScheduler} onClose={() => setShowScheduler(false)} />
    </>
  )
}
