"use client"

import { X, Building, Mail, Phone, Globe, Shield, FileText, MapPin } from "lucide-react"

interface ImprintModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImprintModal({ isOpen, onClose }: ImprintModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Building size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Legal Information & Imprint</h2>
              <p className="text-slate-200 mt-1">Company details and legal notices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Close imprint"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Company Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="text-blue-600" size={24} />
                Company Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">EURO NEGOCE</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Company Name</h5>
                        <p className="text-gray-600">EURO NEGOCE</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">SIREN Number</h5>
                        <p className="text-gray-600 font-mono">817484934</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">SIRET Number</h5>
                        <p className="text-gray-600 font-mono">81748493400028</p>
                        <p className="text-xs text-gray-500">(Company headquarters)</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">EU VAT Number</h5>
                        <p className="text-gray-600 font-mono">FR31817484934</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Registry</h5>
                        <p className="text-gray-600">RCS Bobigny</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">NAF/APE Code</h5>
                        <p className="text-gray-600 font-mono">4690Z</p>
                        <p className="text-xs text-gray-500">Non-specialized wholesale trade (business-to-business)</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Legal Form</h5>
                        <p className="text-gray-600">Limited Liability Company (SARL)</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Registration Date</h5>
                        <p className="text-gray-600">December 24, 2015</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Registered Address
                      </h5>
                      <p className="text-gray-600">
                        La Courneuve
                        <br />
                        Seine-Saint-Denis
                        <br />
                        93120 France
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Company Size</h5>
                      <p className="text-gray-600">Small and Medium Enterprise (SME)</p>
                      <p className="text-xs text-gray-500 mt-1">50-100 employees</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Mail className="text-green-600" size={24} />
                Contact Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="text-green-600 mt-1" size={20} />
                    <div>
                      <h5 className="font-medium text-gray-700">Email</h5>
                      <a href="mailto:euronegoce.mail@gmail.com" className="text-green-600 hover:underline">
                        euronegoce.mail@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h5 className="font-medium text-gray-700">WhatsApp</h5>
                      <a
                        href="https://wa.me/4915145750507"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +49 151 45750507
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Business Hours</h5>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                  <p className="text-sm text-gray-500">Emergency support available 24/7</p>
                </div>
              </div>
            </section>

            {/* Legal Notices */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="text-purple-600" size={24} />
                Legal Notices
              </h3>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Liability Disclaimer</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The information on this website is provided for general informational purposes only. While we strive
                    to keep the information up to date and correct, we make no representations or warranties of any
                    kind, express or implied, about the completeness, accuracy, reliability, suitability, or
                    availability of the website or the information, products, services, or related graphics contained on
                    the website.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Copyright Notice</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    © 2025 Euro Negoce. All rights reserved. The content, design, graphics, and other materials on this
                    website are protected by copyright and other intellectual property laws. Reproduction, distribution,
                    or transmission of any part of this website without written permission is prohibited.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Privacy & Data Protection</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We are committed to protecting your privacy and personal data in accordance with GDPR and applicable
                    data protection laws. For detailed information about how we collect, use, and protect your data,
                    please refer to our Privacy Policy. By using this website, you consent to our use of cookies and
                    data collection practices as outlined in our cookie policy.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Governing Law</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of France and
                    the European Union. Any disputes relating to these terms and conditions will be subject to the
                    exclusive jurisdiction of the French courts, specifically the Commercial Court of Bobigny.
                  </p>
                </div>
              </div>
            </section>

            {/* Regulatory Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="text-indigo-600" size={24} />
                Regulatory Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Trade Licenses & Certifications</h4>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• International Trade License: Valid across EU and MENA regions</li>
                    <li>• Food Safety Certification: HACCP, ISO 22000, FSSC 22000</li>
                    <li>• Organic Certification: EU Organic, BIO certified products</li>
                    <li>• Quality Management: ISO 9001:2015 certified</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Regulatory Compliance</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Euro Negoce operates in full compliance with international trade regulations, food safety standards,
                    and import/export requirements across all markets we serve. We maintain all necessary licenses and
                    certifications for international food trade as registered under NAF code 4690Z.
                  </p>
                </div>
              </div>
            </section>

            {/* Website Information */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-orange-600" size={24} />
                Website Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Website Publisher</h4>
                  <p className="text-gray-600 text-sm">
                    This website is published by Euro Negoce (SIREN: 817484934), a limited liability company registered
                    in France. The website content is managed by our communications team under the supervision of
                    company management.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Technical Information</h4>
                  <p className="text-gray-600 text-sm">
                    Website hosted in accordance with French and European data protection regulations. All technical
                    aspects comply with accessibility standards and GDPR requirements.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Last updated: January 2025 | For questions regarding this imprint, please contact us directly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
