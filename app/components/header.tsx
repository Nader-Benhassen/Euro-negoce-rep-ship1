"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useState as useStateReact } from "react"
import { Mail, ChevronDown, FileText, Award, Menu, X } from "lucide-react"
import FaqModal from "./faq-modal"
import ImprintModal from "./imprint-modal"
import ContactFormModal from "./contact-form-modal"

// Translation hook
const useTranslation = () => {
  const [language, setLanguage] = useState("en")

  const translations = {
    en: {
      headerTitle: "Euro Negoce",
    },
  }

  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key
  const changeLanguage = (lng: string) => setLanguage(lng)

  return { t, i18n: { language, changeLanguage } }
}

// Active section tracking hook
function useActiveSection(sectionIds: string[] = []) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "")

  useEffect(() => {
    if (sectionIds.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Account for header height

      let currentSection = sectionIds[0]

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = sectionId
            break
          }
        }
      }

      setActiveSection(currentSection)
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [JSON.stringify(sectionIds)])

  return activeSection
}

// Header Component
export default function Header() {
  const { t } = useTranslation()
  const sections = ["about", "operations", "gallery", "testimonials"]
  const activeSection = useActiveSection(sections)
  const [showFaq, setShowFaq] = useStateReact(false)
  const [showImprint, setShowImprint] = useStateReact(false)
  const [showContactForm, setShowContactForm] = useStateReact(false)
  const [showCertifications, setShowCertifications] = useStateReact(false)
  const [showDropdown, setShowDropdown] = useStateReact(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useStateReact(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const linkClasses = useCallback(
    (sectionId: string) =>
      `relative px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg whitespace-nowrap ${
        activeSection === sectionId
          ? "text-white bg-blue-500/30 border border-blue-300/50 shadow-lg"
          : "text-slate-300 hover:text-white hover:bg-blue-800/20 hover:border hover:border-blue-400/30"
      }`,
    [activeSection],
  )

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleDropdownItemClick = (action: () => void) => {
    action()
    setShowDropdown(false)
    setMobileMenuOpen(false)
  }

  const handleContactFromFaq = () => {
    setShowFaq(false)
    setShowContactForm(true)
  }

  const handleContactClick = () => {
    setShowContactForm(true)
  }

  return (
    <>
      <header className="fixed w-full z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-xl border-b border-slate-600/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
            {/* Logo - Made bigger */}
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide whitespace-nowrap">
                {t("headerTitle")}
              </h1>
            </div>

            {/* Desktop Navigation - Always visible on large screens */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
                <a href="#about" className={linkClasses("about")} onClick={(e) => handleSectionClick(e, "about")}>
                  About Us
                </a>
                <a
                  href="#operations"
                  className={linkClasses("operations")}
                  onClick={(e) => handleSectionClick(e, "operations")}
                >
                  Operations
                </a>
                <a href="#gallery" className={linkClasses("gallery")} onClick={(e) => handleSectionClick(e, "gallery")}>
                  Products
                </a>
                <button
                  className={`relative px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/20 hover:border hover:border-blue-400/30 whitespace-nowrap`}
                  onClick={() => setShowFaq(true)}
                >
                  FAQ
                </button>

                {/* Desktop Dropdown Menu - Now only contains Certifications and Imprint */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className={`relative px-2 lg:px-3 py-2 text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800/20 hover:border hover:border-blue-400/30 flex items-center gap-1 whitespace-nowrap ${
                      showDropdown ? "bg-blue-800/20 text-white" : ""
                    }`}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    More
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Desktop Dropdown Content - Only Certifications and Imprint */}
                  {showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]">
                      <button
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                        onClick={() => handleDropdownItemClick(() => setShowCertifications(true))}
                      >
                        <Award size={16} className="text-green-600" />
                        Certifications
                      </button>
                      <button
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                        onClick={() => handleDropdownItemClick(() => setShowImprint(true))}
                      >
                        <FileText size={16} className="text-blue-600" />
                        Imprint
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Contact Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Contact Button - Made bigger */}
              <button
                className="relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 whitespace-nowrap shadow-lg hover:shadow-xl"
                onClick={handleContactClick}
              >
                <Mail size={14} />
                <span className="hidden sm:inline">Contact Us</span>
                <span className="sm:hidden">Contact</span>
              </button>

              {/* Mobile Menu Toggle - Only visible on small screens */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-blue-800/20 transition-all duration-200 rounded-lg"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-600/30 bg-slate-900/95 backdrop-blur-sm">
              <nav className="py-4 space-y-2">
                <a
                  href="#about"
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={(e) => handleSectionClick(e, "about")}
                >
                  About Us
                </a>
                <a
                  href="#operations"
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={(e) => handleSectionClick(e, "operations")}
                >
                  Operations
                </a>
                <a
                  href="#gallery"
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={(e) => handleSectionClick(e, "gallery")}
                >
                  Products
                </a>
                <a
                  href="#testimonials"
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={(e) => handleSectionClick(e, "testimonials")}
                >
                  Testimonials
                </a>
                <button
                  className="block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={() => handleDropdownItemClick(() => setShowFaq(true))}
                >
                  FAQ
                </button>

                {/* Other items in mobile menu */}
                <div className="border-t border-slate-600/30 my-2"></div>
                <button
                  className="block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={() => handleDropdownItemClick(() => setShowCertifications(true))}
                >
                  Certifications
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={() => handleDropdownItemClick(() => setShowImprint(true))}
                >
                  Imprint
                </button>
                <button
                  className="block w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-blue-800/20 transition-colors rounded-lg"
                  onClick={handleContactClick}
                >
                  Contact Us
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* FAQ Modal */}
      <FaqModal isOpen={showFaq} onClose={() => setShowFaq(false)} onContactClick={handleContactFromFaq} />

      {/* Imprint Modal */}
      <ImprintModal isOpen={showImprint} onClose={() => setShowImprint(false)} />

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={showContactForm} onClose={() => setShowContactForm(false)} />
    </>
  )
}
