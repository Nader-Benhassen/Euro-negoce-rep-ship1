"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  X,
  MessageCircle,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Calculator,
  Phone,
  Mail,
  Package,
  Settings,
  Search,
  User,
  Building2,
} from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  type?: "text" | "quick-reply" | "product-card" | "quote-form" | "contact-info" | "action-buttons" | "typing"
  data?: any
  rating?: number
  suggestions?: string[]
  entities?: string[]
}

interface ChatBotProps {
  onOpenProducts?: () => void
  onOpenContact?: () => void
  onOpenQuote?: () => void
  onOpenAppointment?: () => void
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  description: string
}

interface ProductInfo {
  name: string
  origin: string
  season: string
  specifications: Record<string, string>
  description: string
  nutritionalBenefits?: string[]
  culinaryUses?: string[]
  storageConditions?: string
  harvestMethods?: string
  qualityGrades?: string[]
}

export default function ChatBot({ onOpenProducts, onOpenContact, onOpenQuote, onOpenAppointment }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversationContext, setConversationContext] = useState({
    topics: [] as string[],
    products: [] as string[],
    lastQuery: "",
    queryCount: 0,
    sessionStart: new Date(),
    userCompany: "",
    location: "",
    businessType: "",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simplified product database without certifications
  const productDatabase: Record<string, ProductInfo> = {
    "olive-oil": {
      name: "Premium Extra Virgin Olive Oil",
      origin: "Tunisia - Sfax Region",
      season: "Year-round availability",
      specifications: {
        acidity: "< 0.8%",
        extraction: "Cold-pressed within 24 hours",
        color: "Golden to deep green",
        taste: "Robust with peppery finish",
      },
      description: "Premium extra virgin olive oil from century-old Tunisian groves.",
      nutritionalBenefits: ["Rich in monounsaturated fats", "High polyphenol content", "Vitamin E and antioxidants"],
      culinaryUses: ["Salad dressings", "Cooking and sautéing", "Bread dipping"],
      storageConditions: "Cool, dark place away from heat",
      harvestMethods: "Hand-picked, cold-pressed within 24 hours",
      qualityGrades: ["Extra Virgin", "Premium Extra Virgin"],
    },
    "rapeseed-oil": {
      name: "Premium Rapeseed Oil",
      origin: "European Farms",
      season: "Year-round availability",
      specifications: {
        smokePoint: "204°C",
        color: "Light golden yellow",
        taste: "Neutral, clean",
      },
      description: "High-quality rapeseed oil ideal for cooking and food manufacturing.",
      nutritionalBenefits: ["Low saturated fat content", "Rich in Omega-3 fatty acids", "High smoke point"],
      culinaryUses: ["High-heat cooking", "Baking", "Food manufacturing"],
      storageConditions: "Cool, dry place",
      harvestMethods: "Mechanically harvested, modern extraction",
      qualityGrades: ["Food Grade", "Premium Food Grade"],
    },
    oranges: {
      name: "Mediterranean Oranges",
      origin: "Tunisia, Spain, Italy",
      season: "November-April",
      specifications: {
        varieties: "Valencia, Navel, Blood Orange",
        size: "60-80mm diameter",
        brix: "11-13%",
      },
      description: "Sweet and juicy oranges from Mediterranean groves.",
      nutritionalBenefits: ["High in Vitamin C", "Dietary fiber", "Natural antioxidants"],
      culinaryUses: ["Fresh consumption", "Juice production", "Cooking and baking"],
      storageConditions: "2-8°C, high humidity",
      harvestMethods: "Hand-picked at optimal ripeness",
      qualityGrades: ["Extra Class", "Class I"],
    },
    apples: {
      name: "European Apples",
      origin: "France, Italy, Poland",
      season: "August-May",
      specifications: {
        varieties: "Gala, Golden Delicious, Fuji, Granny Smith",
        size: "70-85mm diameter",
        brix: "12-14%",
      },
      description: "Premium quality European apples with excellent flavor and texture.",
      nutritionalBenefits: ["Dietary fiber", "Vitamin C", "Natural antioxidants"],
      culinaryUses: ["Fresh consumption", "Baking and cooking", "Juice production"],
      storageConditions: "0-4°C, controlled atmosphere",
      harvestMethods: "Hand-picked at optimal maturity",
      qualityGrades: ["Extra Class", "Class I"],
    },
    artichoke: {
      name: "Mediterranean Artichokes",
      origin: "Tunisia, Italy, Spain",
      season: "October-May",
      specifications: {
        varieties: "Green Globe, Imperial Star",
        size: "Medium to large",
        color: "Green to purple-green",
      },
      description: "Premium Mediterranean artichokes with tender hearts and excellent flavor.",
      nutritionalBenefits: ["High in dietary fiber", "Rich in antioxidants", "Low calorie"],
      culinaryUses: ["Steamed or grilled", "Stuffed preparations", "Preserved in oil"],
      storageConditions: "2-4°C, high humidity",
      harvestMethods: "Hand-harvested when heads are tight",
      qualityGrades: ["Extra Class", "Class I"],
    },
    "baklouti-pepper": {
      name: "Tunisian Baklouti Peppers",
      origin: "Tunisia - Nabeul region",
      season: "June-October",
      specifications: {
        heat: "Medium-hot",
        size: "10-15cm length",
        color: "Bright red when ripe",
      },
      description: "Authentic Tunisian peppers essential for traditional harissa production.",
      nutritionalBenefits: ["High in Vitamin C", "Capsaicin content", "Antioxidants"],
      culinaryUses: ["Harissa paste", "Spice blends", "Traditional cooking"],
      storageConditions: "7-10°C for fresh, cool dry place for dried",
      harvestMethods: "Hand-picked at optimal ripeness",
      qualityGrades: ["Premium", "Standard"],
    },
    pears: {
      name: "European Pears",
      origin: "France, Belgium, Netherlands",
      season: "August-February",
      specifications: {
        varieties: "Conference, Williams, Comice",
        size: "65-75mm diameter",
        brix: "11-14%",
      },
      description: "Premium European pears with exceptional flavor and texture.",
      nutritionalBenefits: ["Dietary fiber", "Vitamin C", "Natural sugars"],
      culinaryUses: ["Fresh consumption", "Baking and desserts", "Preserves"],
      storageConditions: "0-2°C, controlled atmosphere",
      harvestMethods: "Hand-picked at optimal maturity",
      qualityGrades: ["Extra Class", "Class I"],
    },
    peaches: {
      name: "Mediterranean Peaches",
      origin: "Spain, Italy, Tunisia",
      season: "June-September",
      specifications: {
        varieties: "Yellow flesh, White flesh",
        size: "65-80mm diameter",
        brix: "10-13%",
      },
      description: "Sweet, juicy Mediterranean peaches with excellent flavor and aroma.",
      nutritionalBenefits: ["Vitamin C", "Vitamin A", "Natural antioxidants"],
      culinaryUses: ["Fresh consumption", "Desserts and pastries", "Preserves"],
      storageConditions: "0-2°C, high humidity",
      harvestMethods: "Hand-picked at optimal ripeness",
      qualityGrades: ["Extra Class", "Class I"],
    },
  }

  const quickActions: QuickAction[] = [
    {
      id: "products",
      label: "Product Catalog",
      icon: <Package size={18} />,
      action: () => onOpenProducts?.(),
      description: "Browse our premium products",
    },
    {
      id: "quote",
      label: "Request Quote",
      icon: <Calculator size={18} />,
      action: () => onOpenQuote?.(),
      description: "Get pricing information",
    },
    {
      id: "consultation",
      label: "Expert Consultation",
      icon: <Phone size={18} />,
      action: () => onOpenAppointment?.(),
      description: "Schedule with specialists",
    },
    {
      id: "contact",
      label: "Contact Support",
      icon: <Mail size={18} />,
      action: () => onOpenContact?.(),
      description: "Reach our support team",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now().toString(),
      text: `Welcome to Euro Negoce! 👋

I'm here to help you with information about our premium agricultural products and services.

**Our Product Range:**
• Premium Olive Oil & Rapeseed Oil
• Fresh Fruits: Apples, Pears, Peaches, Oranges
• Vegetables: Artichokes
• Specialty: Tunisian Baklouti Peppers

**I can assist you with:**
• Product specifications and quality details
• Seasonal availability and origins
• Shipping and logistics guidance
• Quality assurance processes

**For pricing and quotes, please use our quote request form or contact our sales team directly.**

How can I help you today?`,
      isBot: true,
      timestamp: new Date(),
      type: "text" as const,
      suggestions: [
        "Tell me about your olive oil",
        "What fruits do you offer?",
        "Tunisian baklouti peppers info",
        "Shipping information to Europe",
        "Seasonal product availability",
      ],
    }

    setMessages([welcomeMessage])
    setTimeout(() => addQuickActionsMessage(), 2000)
  }

  const addQuickActionsMessage = () => {
    const quickActionsMessage = {
      id: (Date.now() + 1).toString(),
      text: "Quick Actions",
      isBot: true,
      timestamp: new Date(),
      type: "action-buttons" as const,
      data: quickActions,
    }
    setMessages((prev) => [...prev, quickActionsMessage])
  }

  const addMessage = (text: string, isBot: boolean, type: Message["type"] = "text", data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      type,
      data,
      entities: extractEntities(text),
    }
    setMessages((prev) => [...prev, newMessage])

    if (isBot && !isOpen) {
      setUnreadCount((prev) => prev + 1)
    }
  }

  const addTypingIndicator = () => {
    const typingMessage: Message = {
      id: "typing",
      text: "",
      isBot: true,
      timestamp: new Date(),
      type: "typing",
    }
    setMessages((prev) => [...prev, typingMessage])
  }

  const removeTypingIndicator = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== "typing"))
  }

  const addBotMessage = (text: string, type: Message["type"] = "text", data?: any) => {
    setIsTyping(true)
    addTypingIndicator()

    // Shorter delay for concise responses
    const delay = Math.min(800 + text.length * 8, 2500)

    setTimeout(() => {
      removeTypingIndicator()
      setIsTyping(false)
      addMessage(text, true, type, data)
    }, delay)
  }

  const extractEntities = (text: string): string[] => {
    const entities: string[] = []
    const productKeywords = Object.keys(productDatabase)

    // Extract product mentions
    productKeywords.forEach((product) => {
      const normalizedProduct = product.replace("-", " ")
      if (text.toLowerCase().includes(normalizedProduct)) {
        entities.push(product)
      }
    })

    // Extract topics
    const topicKeywords = {
      pricing: ["price", "cost", "quote", "pricing", "rate", "fee", "charge"],
      shipping: ["shipping", "delivery", "logistics", "transport", "freight"],
      quality: ["quality", "standard", "compliance"],
      schedule: ["schedule", "appointment", "meeting", "call", "consultation"],
    }

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
        entities.push(topic)
      }
    })

    return entities
  }

  const updateConversationContext = (userMessage: string, entities: string[]) => {
    setConversationContext((prev) => {
      const newContext = { ...prev }
      newContext.queryCount += 1
      newContext.lastQuery = userMessage

      // Update topics and products
      entities.forEach((entity) => {
        if (Object.keys(productDatabase).includes(entity)) {
          if (!newContext.products.includes(entity)) {
            newContext.products.push(entity)
          }
        } else if (!newContext.topics.includes(entity)) {
          newContext.topics.push(entity)
        }
      })

      return newContext
    })
  }

  const getSmartResponse = (userMessage: string): { text: string; type?: Message["type"]; data?: any } => {
    const message = userMessage.toLowerCase()
    const entities = extractEntities(userMessage)

    // Update conversation context
    updateConversationContext(userMessage, entities)

    // Handle pricing requests - redirect to quote form
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("quote") ||
      message.includes("pricing") ||
      message.includes("minimum order") ||
      message.includes("moq")
    ) {
      setTimeout(() => onOpenQuote?.(), 1500)

      return {
        text: `For pricing information and quotes, please use our quote request form. Our sales team will provide you with competitive pricing based on your specific requirements.

I'll open the quote form for you now.`,
        type: "quote-form",
      }
    }

    // Olive Oil Information
    if (message.includes("olive oil") || message.includes("olives")) {
      const product = productDatabase["olive-oil"]

      return {
        text: `**${product.name}**

**Origin:** ${product.origin}
**Season:** ${product.season}

**Key Specifications:**
• Acidity: ${product.specifications.acidity}
• Extraction: ${product.specifications.extraction}
• Taste: ${product.specifications.taste}

**Health Benefits:**
${product.nutritionalBenefits?.map((benefit) => `• ${benefit}`).join("\n")}

**Uses:** ${product.culinaryUses?.join(", ")}

Would you like more details about quality standards or shipping information?`,
      }
    }

    // Rapeseed Oil Information
    if (message.includes("rapeseed") || message.includes("canola")) {
      const product = productDatabase["rapeseed-oil"]

      return {
        text: `**${product.name}**

**Origin:** ${product.origin}
**Season:** ${product.season}

**Key Specifications:**
• Smoke Point: ${product.specifications.smokePoint}
• Color: ${product.specifications.color}
• Taste: ${product.specifications.taste}

**Benefits:**
${product.nutritionalBenefits?.map((benefit) => `• ${benefit}`).join("\n")}

**Applications:** ${product.culinaryUses?.join(", ")}

Perfect for high-heat cooking and food manufacturing.`,
      }
    }

    // Fresh Produce Information
    if (
      message.includes("fruit") ||
      message.includes("orange") ||
      message.includes("apple") ||
      message.includes("produce") ||
      message.includes("peach") ||
      message.includes("pear") ||
      message.includes("artichoke")
    ) {
      // Handle general fruit/produce queries
      if (
        message.includes("fruit") &&
        !message.includes("orange") &&
        !message.includes("apple") &&
        !message.includes("peach") &&
        !message.includes("pear")
      ) {
        return {
          text: `**Our Fresh Fruit Selection**

**Available Fruits:**
• **Apples** - European varieties (August-May)
• **Pears** - Premium European pears (August-February)  
• **Peaches** - Mediterranean peaches (June-September)
• **Oranges** - Mediterranean oranges (November-April)

**Vegetables:**
• **Artichokes** - Mediterranean artichokes (October-May)

**Specialty Products:**
• **Tunisian Baklouti Peppers** - Authentic peppers for harissa (June-October)

All products come with complete traceability and quality guarantees. Which specific product would you like to know more about?`,
        }
      }

      let specificProduce = "oranges"
      if (message.includes("apple")) specificProduce = "apples"
      if (message.includes("peach")) specificProduce = "peaches"
      if (message.includes("pear")) specificProduce = "pears"
      if (message.includes("artichoke")) specificProduce = "artichoke"

      const product = productDatabase[specificProduce]

      return {
        text: `**${product.name}**

**Origin:** ${product.origin}
**Season:** ${product.season}

**Varieties:** ${product.specifications.varieties || "Premium varieties available"}
**Quality:** ${product.qualityGrades?.join(", ")}

**Nutritional Benefits:**
${product.nutritionalBenefits?.map((benefit) => `• ${benefit}`).join("\n")}

**Storage:** ${product.storageConditions}

Fresh, high-quality produce with complete traceability.`,
      }
    }

    // Shipping Information
    if (message.includes("shipping") || message.includes("delivery") || message.includes("logistics")) {
      return {
        text: `**Shipping & Logistics**

**Methods Available:**
• Road transport (Europe): 2-5 days
• Sea freight (Worldwide): 5-15 days
• Air freight (Express): 1-3 days

**Services:**
• Temperature-controlled transport
• Real-time tracking
• Complete documentation
• Insurance coverage
• Customs clearance support

**Coverage:** We deliver worldwide with specialized cold chain for fresh products.

Which destination are you interested in?`,
      }
    }

    // Quality Information (without certifications)
    if (message.includes("quality") || message.includes("standard") || message.includes("compliance")) {
      return {
        text: `**Quality Assurance**

**Quality Process:**
• Source verification and audits
• Laboratory testing and analysis
• Cold chain management
• Pre-shipment quality checks
• Complete traceability

**Testing:** Microbiological, chemical, and physical analysis for all products.

**Standards:** We maintain the highest international quality standards and all products come with quality guarantees.

Would you like specific information about our testing procedures?`,
      }
    }

    // Company Information
    if (message.includes("company") || message.includes("about") || message.includes("euro negoce")) {
      return {
        text: `**About Euro Negoce**

**Established:** 2015
**Headquarters:** Courneuve, France
**Operations:** Paris, France

**Specializations:**
• Premium olive oil trading
• Fresh Mediterranean produce
• Bulk commodities
• Supply chain management

**Mission:** Connecting premium Mediterranean products with global markets through quality, reliability, and professional service.

How can we serve your business needs?`,
      }
    }

    // Contact Information
    if (
      message.includes("contact") ||
      message.includes("reach") ||
      message.includes("phone") ||
      message.includes("email")
    ) {
      setTimeout(() => onOpenContact?.(), 1500)

      return {
        text: `**Contact Information**

**Email:** contact@euronegocetrade.com
**Phone:** +33 1 48 11 65 91
**WhatsApp:** +49 151 45750507

**Office Hours:** 9:00 AM - 6:00 PM CET

**Locations:**
• Headquarters: Courneuve, France
• Operations: Paris, France

**Response Times:**
• Email: Within 4 hours
• Phone: Immediate during business hours
• WhatsApp: Within 1 hour

I'll open our contact form for you.`,
        type: "contact-info",
      }
    }

    // Consultation Scheduling
    if (
      message.includes("call") ||
      message.includes("meeting") ||
      message.includes("schedule") ||
      message.includes("consultation")
    ) {
      setTimeout(() => onOpenAppointment?.(), 1500)

      return {
        text: `**Expert Consultation**

**Available Consultations:**
• Sales consultation (30 min)
• Technical review (45 min)
• Market analysis (60 min)
• Partnership discussion (90 min)

**Our Experts:**
• Sales directors
• Quality managers
• Technical specialists
• Market analysts

**Scheduling:** Available across global time zones with video, phone, or in-person options.

I'll open our scheduling system for you.`,
      }
    }

    // Default response
    return {
      text: `I can help you with information about our products, quality standards, shipping, and services.

**Popular topics:**
• Product specifications and origins
• Quality standards and testing
• Shipping and logistics
• Company information
• Expert consultations

**For pricing and quotes, please use our quote request form.**

What specific information would you like to know?`,
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, false)
      const response = getSmartResponse(inputValue)
      addBotMessage(response.text, response.type, response.data)
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const rateMessage = (messageId: string, rating: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)))
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = () => {
    setMessages([])
    setConversationContext({
      topics: [],
      products: [],
      lastQuery: "",
      queryCount: 0,
      sessionStart: new Date(),
      userCompany: "",
      location: "",
      businessType: "",
    })
    initializeChat()
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(true)
            setUnreadCount(0)
          }}
          className="group relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 hover:from-slate-700 hover:via-slate-600 hover:to-slate-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-slate-600/50"
          aria-label="Open Assistant"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>

          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-bounce">
              {unreadCount}
            </div>
          )}

          <div className="absolute bottom-16 right-0 bg-slate-800 text-white rounded-lg shadow-xl p-4 max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-emerald-400" />
              <span className="font-semibold text-sm">Euro Negoce Assistant</span>
            </div>
            <p className="text-xs text-slate-300">
              Product info • Quality standards • Shipping guidance • Expert support
            </p>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden transition-all duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <Building2 className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Euro Negoce</h3>
            <div className="flex items-center text-sm text-slate-200">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              <span>Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="flex-1 text-sm bg-slate-600 text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 justify-center"
            >
              <RefreshCw size={14} />
              New Chat
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm px-4 py-2.5 pl-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages
          .filter((msg) => !searchQuery || msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
              {message.type === "typing" ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 max-w-[85%]">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-500">Preparing response...</span>
                  </div>
                </div>
              ) : message.type === "action-buttons" ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {message.data?.map((action: QuickAction) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-slate-600 group-hover:text-slate-800 transition-colors">
                            {action.icon}
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{action.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                          {action.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`max-w-[85%] group ${message.isBot ? "mr-auto" : "ml-auto"}`}>
                  <div
                    className={`p-4 rounded-2xl relative transition-all duration-200 ${
                      message.isBot
                        ? "bg-white text-slate-800 shadow-lg border border-slate-100 hover:shadow-xl"
                        : "bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg"
                    }`}
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <User size={16} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-600">Euro Negoce Assistant</span>
                      </div>
                    )}

                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>

                    {message.suggestions && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-slate-600 mb-2">Suggestions:</p>
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputValue(suggestion)
                              inputRef.current?.focus()
                            }}
                            className="block w-full text-left text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-lg transition-colors duration-200 border border-slate-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <p className={`text-xs ${message.isBot ? "text-slate-500" : "text-slate-200"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => copyMessage(message.text)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          title="Copy message"
                        >
                          <Copy size={12} className="text-slate-400" />
                        </button>

                        {message.isBot && (
                          <>
                            <button
                              onClick={() => rateMessage(message.id, 1)}
                              className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors duration-200 ${
                                message.rating === 1 ? "text-emerald-500" : "text-slate-400"
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp size={12} />
                            </button>
                            <button
                              onClick={() => rateMessage(message.id, -1)}
                              className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors duration-200 ${
                                message.rating === -1 ? "text-red-500" : "text-slate-400"
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, quality, shipping, or services..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent pr-16 bg-slate-50 focus:bg-white transition-colors duration-200"
              disabled={isTyping}
              maxLength={300}
            />

            <div className="absolute bottom-2 right-14 text-xs text-slate-400">{inputValue.length}/300</div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-300 disabled:to-slate-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
            title="Send message"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center text-xs text-slate-500">
          <span>For pricing information, please use our quote request form</span>
        </div>
      </div>
    </div>
  )
}
