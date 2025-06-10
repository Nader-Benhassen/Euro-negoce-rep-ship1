"use client"

import { useState } from "react"

// Dummy components - replace with actual implementations
const HeroSection = () => <div>Hero Section</div>
const ServicesSection = () => <div>Services Section</div>
const AboutUsSection = () => <div>About Us Section</div>
const ContactSection = () => <div>Contact Section</div>
const Footer = () => <div>Footer</div>
const FaqModal = ({
  isOpen,
  onClose,
  onContactClick,
}: { isOpen: boolean; onClose: () => void; onContactClick: () => void }) => {
  if (!isOpen) return null
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        FAQ Modal
        <button onClick={onClose}>Close</button>
        <button onClick={onContactClick}>Contact Us</button>
      </div>
    </div>
  )
}
const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        Contact Modal
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

const EuroNegoceWebsite = () => {
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <AboutUsSection />
      <ContactSection />
      <Footer />

      <button onClick={() => setShowFaqModal(true)}>Open FAQ Modal</button>

      <FaqModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
        onContactClick={() => setShowContactModal(true)}
      />

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  )
}

export default EuroNegoceWebsite
