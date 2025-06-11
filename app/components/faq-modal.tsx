"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Globe, Package, Truck, FileCheck } from "lucide-react"

interface FaqModalProps {
  isOpen: boolean
  onClose: () => void
  onContactClick?: () => void
}

export default function FaqModal({ isOpen, onClose, onContactClick }: FaqModalProps) {
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (id: string) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((q) => q !== id))
    } else {
      setOpenQuestions([...openQuestions, id])
    }
  }

  const categories = [
    { id: "general", name: "General Questions", icon: <HelpCircle size={18} /> },
    { id: "products", name: "Products & Services", icon: <Package size={18} /> },
    { id: "shipping", name: "Shipping & Logistics", icon: <Truck size={18} /> },
    { id: "certification", name: "Certifications", icon: <FileCheck size={18} /> },
    { id: "international", name: "International Trade", icon: <Globe size={18} /> },
    { id: "contact", name: "Contact & Support", icon: <MessageCircle size={18} /> },
  ]

  const faqs = {
    general: [
      {
        id: "general-1",
        question: "What is Euro Negoce?",
        answer:
          "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils. We serve both wholesale and retail markets across Europe, Middle East, North Africa, and beyond.",
      },
      {
        id: "general-2",
        question: "Where is Euro Negoce headquartered?",
        answer:
          "Our headquarters are located in Paris, France, with regional offices in Munich, Germany and Tunis, Tunisia. This strategic positioning allows us to efficiently serve markets across Europe and the MENA region.",
      },
      {
        id: "general-3",
        question: "How long has Euro Negoce been in business?",
        answer:
          "Euro Negoce was established in 2018 and has quickly grown to become a trusted name in international trade of Mediterranean products, serving over 100 clients across more than 10 countries.",
      },
      {
        id: "general-4",
        question: "What sets Euro Negoce apart from competitors?",
        answer:
          "Our competitive advantage lies in our direct relationships with producers, rigorous quality control processes, efficient logistics network, and commitment to sustainability. We provide end-to-end solutions from sourcing to delivery, ensuring premium quality products reach our clients in optimal condition.",
      },
    ],
    products: [
      {
        id: "products-1",
        question: "What types of products does Euro Negoce offer?",
        answer:
          "We specialize in three main categories: fresh fruits (including citrus, dates, and seasonal Mediterranean fruits), fresh vegetables (tomatoes, peppers, cucumbers, etc.), and premium edible oils (olive oil, rapeseed oil, and specialty oils).",
      },
      {
        id: "products-2",
        question: "Where do your products come from?",
        answer:
          "Our products are sourced from carefully selected producers across the Mediterranean basin, including Spain, Italy, Greece, Tunisia, and other countries known for their high-quality agricultural products. We also work with greenhouse producers in Northern Europe for certain vegetables.",
      },
      {
        id: "products-3",
        question: "Do you offer organic products?",
        answer:
          "Yes, we offer a growing selection of certified organic products across all our categories. These products are clearly labeled with their organic certification information and can be requested specifically when placing orders.",
      },
      {
        id: "products-4",
        question: "What is the minimum order quantity?",
        answer:
          "Minimum order quantities vary by product type. For wholesale clients, typical MOQs range from 100kg for specialty items to 1 ton for common fruits and vegetables. For retail partners, we offer more flexible arrangements. Please contact our sales team for specific product MOQs.",
      },
    ],
    shipping: [
      {
        id: "shipping-1",
        question: "How do you ensure product freshness during shipping?",
        answer:
          "We employ a sophisticated cold chain management system with temperature-controlled vehicles and storage facilities. Our logistics team monitors shipments in real-time, and we use specialized packaging designed to maintain optimal conditions for each product type.",
      },
      {
        id: "shipping-2",
        question: "What shipping methods do you use?",
        answer:
          "Depending on destination, volume, and product type, we utilize road transport (trucks), sea freight, and occasionally air freight for expedited or highly perishable shipments. Our logistics team selects the optimal method for each order.",
      },
      {
        id: "shipping-3",
        question: "How long does shipping typically take?",
        answer:
          "Delivery times vary by destination and shipping method. Within Europe, typical delivery times range from 2-5 days. For MENA region, 5-10 days is standard. For specific delivery estimates to your location, please contact our logistics department.",
      },
      {
        id: "shipping-4",
        question: "Do you handle customs clearance?",
        answer:
          "Yes, we provide comprehensive customs clearance services for our clients. Our experienced team manages all necessary documentation, ensuring smooth border crossings and compliance with international trade regulations.",
      },
    ],
    certification: [
      {
        id: "certification-1",
        question: "What certifications do your products have?",
        answer:
          "Our products carry various certifications including Origin Control, HACCP, Global G.A.P., and many of our suppliers are BIO certified. We also maintain ISO certification for our quality management systems and FSSC 22000 for food safety.",
      },
      {
        id: "certification-2",
        question: "How do you ensure product quality?",
        answer:
          "We implement a rigorous multi-stage quality control process. This includes supplier audits, pre-shipment inspections, quality checks at our facilities, and final verification before delivery. Our quality assurance team follows strict protocols based on international standards.",
      },
      {
        id: "certification-3",
        question: "Can you provide certification documentation?",
        answer:
          "Yes, we provide all relevant certification documentation with our shipments. This includes certificates of origin, quality certificates, organic certifications (where applicable), and any other required documentation for international trade.",
      },
    ],
    international: [
      {
        id: "international-1",
        question: "Which countries do you currently serve?",
        answer:
          "We currently export to over 10 countries, primarily in Europe and the MENA region. Our major markets include France, Germany, UK, Italy, Spain, UAE, Saudi Arabia, and several North African countries.",
      },
      {
        id: "international-2",
        question: "Can you ship to countries not currently in your network?",
        answer:
          "Yes, we are continuously expanding our reach and can establish new shipping routes to meet client needs. Please contact our international trade department to discuss specific requirements for new destinations.",
      },
      {
        id: "international-3",
        question: "How do you handle different regulatory requirements across countries?",
        answer:
          "Our compliance team stays updated on international trade regulations and specific requirements for each country we serve. We ensure all shipments meet local regulatory standards, including labeling, documentation, and product specifications.",
      },
      {
        id: "international-4",
        question: "What payment methods do you accept for international orders?",
        answer:
          "We accept various payment methods including wire transfers, letters of credit, and for established clients, we offer flexible payment terms. All financial transactions are handled securely through major international banks.",
      },
    ],
    contact: [
      {
        id: "contact-1",
        question: "How can I request a quote?",
        answer:
          "You can request a quote by clicking the 'Request a Quote' button on our website, emailing our sales team at contact@euronegocetrade.com, or contacting us via WhatsApp at +49 151 45750507. Please provide details about the products, quantities, and delivery location for an accurate quote.",
      },
      {
        id: "contact-2",
        question: "What information should I include when requesting a quote?",
        answer:
          "To receive the most accurate quote, please include: specific products of interest, required quantities, delivery location, preferred delivery timeline, any special requirements (packaging, certifications, etc.), and your company information.",
      },
      {
        id: "contact-3",
        question: "How quickly will I receive a response to my inquiry?",
        answer:
          "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please indicate the urgency in your message or contact us via WhatsApp for faster response.",
      },
      {
        id: "contact-4",
        question: "Do you offer product samples?",
        answer:
          "Yes, we can provide product samples for potential large-volume clients. Sample requests are evaluated on a case-by-case basis. Please contact our sales team to discuss your specific requirements.",
      },
    ],
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <p className="text-blue-100 mt-1">Find answers to common questions about Euro Negoce</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close FAQ"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-5 gap-0 h-full">
            {/* Categories Sidebar */}
            <div className="md:col-span-1 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3 px-2">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-all ${
                        activeCategory === category.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className={activeCategory === category.id ? "text-blue-600" : "text-gray-500"}>
                        {category.icon}
                      </span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="md:col-span-4 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {categories.find((c) => c.id === activeCategory)?.name}
              </h3>

              <div className="space-y-4">
                {faqs[activeCategory as keyof typeof faqs].map((faq) => {
                  const isOpen = openQuestions.includes(faq.id)

                  return (
                    <div
                      key={faq.id}
                      className={`border rounded-lg transition-all duration-300 ${
                        isOpen ? "border-blue-300 shadow-md" : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <h4 className={`font-medium ${isOpen ? "text-blue-700" : "text-gray-800"}`}>{faq.question}</h4>
                        <span className={`${isOpen ? "text-blue-600" : "text-gray-500"}`}>
                          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </span>
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
                        <div className="p-5 pt-0 border-t border-gray-100">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Still have questions */}
              <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Still have questions?</h4>
                <p className="text-gray-700 mb-4">
                  If you couldn't find the answer to your question, please don't hesitate to contact our team directly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      onClose()
                      onContactClick?.()
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Contact Us
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
