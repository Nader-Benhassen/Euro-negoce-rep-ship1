"use client"

import { X, Shield, Award, CheckCircle, FileCheck, Globe, Leaf } from "lucide-react"

interface CertificationPageProps {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
}

export default function CertificationsPage({ isOpen, onClose, t }: CertificationPageProps) {
  if (!isOpen) return null

  const certifications = [
    {
      id: "origin",
      name: "Origin Control",
      description: "Verified geographical origin control for all our products ensuring traceability and authenticity.",
      icon: <Globe className="text-white" size={24} />,
      benefits: [
        "Guarantees authentic product origins",
        "Ensures compliance with regional production standards",
        "Provides complete traceability from farm to customer",
        "Verifies sustainable and ethical sourcing practices",
      ],
      process:
        "Our Origin Control certification involves rigorous documentation and verification at every step of the supply chain. Products are tracked from the farm through processing, packaging, and distribution with unique identifiers.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      textColor: "text-blue-900",
    },
    {
      id: "haccp",
      name: "HACCP Compliance",
      description: "Hazard Analysis and Critical Control Points for food safety.",
      icon: <Shield className="text-white" size={24} />,
      benefits: [
        "Identifies and controls potential food safety hazards",
        "Ensures systematic preventive approach to food safety",
        "Reduces risk of foodborne illness",
        "Meets international food safety standards",
      ],
      process:
        "Our HACCP system identifies critical control points throughout our supply chain and establishes monitoring procedures, corrective actions, and verification processes to ensure food safety at every stage.",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
      textColor: "text-red-900",
    },
    {
      id: "bio",
      name: "BIO Certified",
      description: "Certified organic farming and production methods.",
      icon: <Leaf className="text-white" size={24} />,
      benefits: [
        "Guarantees products grown without synthetic pesticides or fertilizers",
        "Ensures environmentally sustainable farming practices",
        "Prohibits use of GMOs and artificial additives",
        "Supports biodiversity and ecological balance",
      ],
      process:
        "Our organic certification requires strict adherence to organic farming principles, with regular inspections and documentation of farming practices, processing methods, and handling procedures to ensure compliance with international organic standards.",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      textColor: "text-green-900",
    },
    {
      id: "iso",
      name: "ISO Certified",
      description: "International standard ensuring quality management systems.",
      icon: <Award className="text-white" size={24} />,
      benefits: [
        "Ensures consistent quality management processes",
        "Demonstrates commitment to continuous improvement",
        "Enhances customer satisfaction through quality assurance",
        "Provides internationally recognized quality standards",
      ],
      process:
        "Our ISO certification involves comprehensive documentation of quality management systems, regular internal and external audits, and ongoing process improvements to ensure consistent quality across all operations.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      textColor: "text-purple-900",
    },
    {
      id: "global-gap",
      name: "Global G.A.P.",
      description: "Good Agricultural Practices certification for safe and sustainable agriculture.",
      icon: <CheckCircle className="text-white" size={24} />,
      benefits: [
        "Ensures responsible farming practices",
        "Reduces environmental impact of agricultural operations",
        "Improves worker health and safety",
        "Enhances food safety through farm-level controls",
      ],
      process:
        "Global G.A.P. certification requires adherence to strict agricultural practices including soil management, pest control, responsible water usage, and worker welfare, with regular on-site inspections and documentation reviews.",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
      textColor: "text-teal-900",
    },
    {
      id: "fssc",
      name: "FSSC 22000",
      description: "Food Safety System Certification for food manufacturing and processing.",
      icon: <FileCheck className="text-white" size={24} />,
      benefits: [
        "Provides comprehensive food safety management",
        "Ensures compliance with international food safety standards",
        "Addresses food defense and food fraud vulnerabilities",
        "Facilitates international trade through recognized certification",
      ],
      process:
        "FSSC 22000 certification combines ISO 22000 food safety management requirements with sector-specific prerequisite programs, requiring extensive documentation, hazard analysis, and regular audits to ensure food safety throughout the supply chain.",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      textColor: "text-amber-900",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Certifications & Compliance</h2>
              <p className="text-green-100 mt-1">Our commitment to quality, safety, and sustainability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close certifications page"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="p-8">
            {/* Introduction */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Quality Assurance</h3>
              <p className="text-lg text-gray-600">
                At Euro Negoce, we maintain the highest standards of quality, safety, and sustainability through
                rigorous certification processes and compliance with international standards. Our certifications ensure
                that every product we deliver meets or exceeds industry requirements.
              </p>
            </div>

            {/* Certifications Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {certifications.map((cert) => (
                <div key={cert.id} className="group">
                  <div
                    className={`bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 h-full hover:scale-[1.02] overflow-hidden relative`}
                  >
                    {/* Background gradient effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cert.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-6">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${cert.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
                        >
                          {cert.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold ${cert.textColor} text-2xl mb-1`}>{cert.name}</h4>
                          <div className={`w-16 h-1 bg-gradient-to-r ${cert.gradient} rounded-full`}></div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6">{cert.description}</p>

                      <div className="mb-6">
                        <h5 className={`font-semibold ${cert.textColor} mb-3`}>Key Benefits:</h5>
                        <ul className="space-y-2">
                          {cert.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className={`font-semibold ${cert.textColor} mb-3`}>Certification Process:</h5>
                        <p className="text-gray-700">{cert.process}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Commitment Section */}
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Commitment to Excellence</h3>
              <p className="text-gray-700 mb-6">
                Beyond certifications, Euro Negoce is committed to continuous improvement in all aspects of our
                operations. We regularly review and enhance our processes to ensure we deliver the highest quality
                products while minimizing environmental impact and supporting sustainable agriculture.
              </p>
              <p className="text-gray-700">
                Our team works closely with farmers, producers, and logistics partners to maintain these high standards
                throughout our supply chain, from farm to customer. This comprehensive approach to quality assurance is
                what sets Euro Negoce apart as a trusted partner in international trade.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              For detailed certification documentation, please contact our quality assurance team.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
