"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, ChevronDown, ChevronUp, User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type Message = {
  id: string
  type: "user" | "bot"
  text: string
  timestamp: Date
  buttons?: ChatButton[]
}

type ChatButton = {
  id: string
  text: string
  action: "quote" | "call" | "products" | "contact" | "link" | "custom"
  value?: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize chat with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        text: "👋 Welcome to Euro Negoce! I'm your virtual assistant. How can I help you today?",
        timestamp: new Date(),
        buttons: [
          { id: "products", text: "View Products", action: "products" },
          { id: "quote", text: "Request Quote", action: "quote" },
          { id: "call", text: "Schedule Call", action: "call" },
          { id: "contact", text: "Contact Us", action: "contact" },
        ],
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateResponse(inputValue)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleButtonClick = (button: ChatButton) => {
    // Add user message based on button
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: button.text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = handleButtonAction(button)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }

  const handleButtonAction = (button: ChatButton): Message => {
    switch (button.action) {
      case "quote":
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "I'd be happy to help you request a quote! Please provide the following information:\n\n1. Product(s) you're interested in\n2. Quantity needed\n3. Delivery location\n4. Timeframe\n\nOr you can click the button below to open our quote request form:",
          timestamp: new Date(),
          buttons: [
            {
              id: "open-quote-form",
              text: "Open Quote Form",
              action: "custom",
              value: "openQuoteModal",
            },
          ],
        }
      case "call":
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "Would you like to schedule a call with our team? You can choose a convenient time and one of our representatives will contact you.",
          timestamp: new Date(),
          buttons: [
            {
              id: "schedule-call",
              text: "Schedule a Call",
              action: "custom",
              value: "openCallScheduler",
            },
          ],
        }
      case "products":
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "Euro Negoce offers a wide range of premium products including:\n\n• Premium Olive Oil (Tunisia)\n• Rapeseed Oil (Tunisia)\n• Fresh Fruits & Vegetables\n• Dates, Nuts & Dried Fruits\n\nWhat specific product are you interested in?",
          timestamp: new Date(),
          buttons: [
            { id: "olive-oil", text: "Olive Oil", action: "custom", value: "productOliveOil" },
            { id: "rapeseed-oil", text: "Rapeseed Oil", action: "custom", value: "productRapeseedOil" },
            { id: "fruits", text: "Fresh Fruits", action: "custom", value: "productFruits" },
            { id: "vegetables", text: "Vegetables", action: "custom", value: "productVegetables" },
          ],
        }
      case "contact":
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "You can reach Euro Negoce through the following channels:\n\n• Email: euronegoce.mail@gmail.com\n• Office: Paris, France\n• Headquarters: Courneuve, France\n\nWould you like to send us a message directly?",
          timestamp: new Date(),
          buttons: [
            {
              id: "contact-form",
              text: "Contact Form",
              action: "custom",
              value: "openContactModal",
            },
            {
              id: "email-direct",
              text: "Email Us",
              action: "link",
              value: "mailto:euronegoce.mail@gmail.com",
            },
          ],
        }
      case "custom":
        if (button.value === "openQuoteModal") {
          // Logic to open quote modal
          if (typeof window !== "undefined") {
            const event = new CustomEvent("openQuoteModal")
            window.dispatchEvent(event)
          }
          return {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: "I've opened the quote request form for you. Please fill in your details and our team will get back to you as soon as possible.",
            timestamp: new Date(),
          }
        } else if (button.value === "openCallScheduler") {
          // Logic to open call scheduler
          if (typeof window !== "undefined") {
            const event = new CustomEvent("openCallScheduler")
            window.dispatchEvent(event)
          }
          return {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: "I've opened the call scheduler for you. Please select a convenient time for our team to contact you.",
            timestamp: new Date(),
          }
        } else if (button.value === "openContactModal") {
          // Logic to open contact modal
          if (typeof window !== "undefined") {
            const event = new CustomEvent("openContactModal")
            window.dispatchEvent(event)
          }
          return {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: "I've opened the contact form for you. Please fill in your details and our team will get back to you as soon as possible.",
            timestamp: new Date(),
          }
        } else if (button.value?.startsWith("product")) {
          const productType = button.value.replace("product", "").toLowerCase()
          return {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: `Our ${productType} products are sourced from the finest producers in the Mediterranean region. Would you like to request a quote for this product?`,
            timestamp: new Date(),
            buttons: [
              {
                id: `quote-${productType}`,
                text: `Request ${productType} Quote`,
                action: "custom",
                value: "openQuoteModal",
              },
              {
                id: `more-${productType}`,
                text: `More About ${productType}`,
                action: "custom",
                value: `showMore${productType}`,
              },
            ],
          }
        } else if (button.value?.startsWith("showMore")) {
          const productType = button.value.replace("showMore", "").toLowerCase()
          let productInfo = ""

          switch (productType) {
            case "oliveoil":
              productInfo =
                "Our Extra Virgin Olive Oil is cold-pressed from century-old Mediterranean trees in Tunisia. It features exceptional quality with Origin Control, HACCP, and BIO certifications. Perfect for cooking and culinary applications with a rich, authentic Mediterranean flavor."
              break
            case "rapeseedoil":
              productInfo =
                "Our Premium Rapeseed Oil from Tunisia offers excellent cooking properties with a neutral taste and high smoke point. It's certified with Origin Control and HACCP standards, making it ideal for professional kitchens and food manufacturing."
              break
            case "fruits":
              productInfo =
                "We offer a wide variety of fresh Mediterranean fruits including oranges, apples, pears, peaches, strawberries, dates, watermelons, melons, pineapples, and dragon fruit. All sourced from premium groves across Europe and Mediterranean regions."
              break
            case "vegetables":
              productInfo =
                "Our vegetable selection includes fresh artichokes, Tunisian Baklouti peppers, bell peppers, garlic, and premium potatoes. All vegetables are carefully selected for quality and freshness from trusted Mediterranean suppliers."
              break
            default:
              productInfo =
                "Our products are carefully sourced from premium Mediterranean suppliers and meet the highest quality standards with proper certifications."
          }

          return {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: productInfo,
            timestamp: new Date(),
            buttons: [
              {
                id: `quote-${productType}`,
                text: "Request Quote",
                action: "custom",
                value: "openQuoteModal",
              },
              {
                id: "contact-more-info",
                text: "Contact for More Info",
                action: "custom",
                value: "openContactModal",
              },
            ],
          }
        }
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "I'm sorry, I couldn't process that request. How else can I help you?",
          timestamp: new Date(),
        }
      case "link":
        if (button.value && typeof window !== "undefined") {
          window.open(button.value, "_blank")
        }
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "I've opened the link for you. Is there anything else I can help with?",
          timestamp: new Date(),
        }
      default:
        return {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "I'm sorry, I couldn't process that request. How else can I help you?",
          timestamp: new Date(),
        }
    }
  }

  const generateResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase()

    // Check for keywords and provide appropriate responses
    if (lowerInput.includes("olive oil") || lowerInput.includes("oil")) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Euro Negoce offers premium olive oil sourced directly from Tunisia. Our olive oil is known for its exceptional quality and flavor. Would you like to know more or request a quote?",
        timestamp: new Date(),
        buttons: [
          { id: "quote-oil", text: "Request Oil Quote", action: "quote" },
          { id: "more-oil", text: "More About Our Oils", action: "products" },
        ],
      }
    } else if (lowerInput.includes("fruit") || lowerInput.includes("vegetable") || lowerInput.includes("produce")) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "We offer a wide variety of fresh Mediterranean fruits and vegetables. Our produce is sourced from the best farms in Tunisia, Spain, and Italy. What specific products are you interested in?",
        timestamp: new Date(),
        buttons: [
          { id: "fruits-info", text: "Fresh Fruits", action: "custom", value: "productFruits" },
          { id: "vegetables-info", text: "Vegetables", action: "custom", value: "productVegetables" },
        ],
      }
    } else if (
      lowerInput.includes("price") ||
      lowerInput.includes("cost") ||
      lowerInput.includes("quote") ||
      lowerInput.includes("pricing")
    ) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Our pricing depends on the product, quantity, and delivery location. I'd be happy to help you get a personalized quote. Would you like to fill out our quote request form?",
        timestamp: new Date(),
        buttons: [
          {
            id: "get-quote",
            text: "Request Quote",
            action: "custom",
            value: "openQuoteModal",
          },
        ],
      }
    } else if (
      lowerInput.includes("contact") ||
      lowerInput.includes("speak") ||
      lowerInput.includes("talk") ||
      lowerInput.includes("call") ||
      lowerInput.includes("email")
    ) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "You can reach our team via email at euronegoce.mail@gmail.com or schedule a call with one of our representatives. How would you prefer to contact us?",
        timestamp: new Date(),
        buttons: [
          {
            id: "schedule-call",
            text: "Schedule a Call",
            action: "custom",
            value: "openCallScheduler",
          },
          {
            id: "send-email",
            text: "Send Email",
            action: "link",
            value: "mailto:euronegoce.mail@gmail.com",
          },
          {
            id: "contact-form",
            text: "Contact Form",
            action: "custom",
            value: "openContactModal",
          },
        ],
      }
    } else if (
      lowerInput.includes("location") ||
      lowerInput.includes("office") ||
      lowerInput.includes("where") ||
      lowerInput.includes("address")
    ) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Euro Negoce has two locations in France:\n\n• Office: Paris, France\n• Headquarters: Courneuve, France\n\nWe also have partner facilities across the Mediterranean region.",
        timestamp: new Date(),
      }
    } else if (lowerInput.includes("shipping") || lowerInput.includes("delivery") || lowerInput.includes("transport")) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "We handle international shipping to destinations worldwide. Shipping costs and delivery times depend on your location and order volume. Would you like to discuss your specific shipping requirements?",
        timestamp: new Date(),
        buttons: [
          {
            id: "shipping-quote",
            text: "Get Shipping Quote",
            action: "custom",
            value: "openQuoteModal",
          },
        ],
      }
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Hello! Welcome to Euro Negoce. How can I assist you today?",
        timestamp: new Date(),
        buttons: [
          { id: "products-info", text: "Products Information", action: "products" },
          { id: "request-quote", text: "Request a Quote", action: "quote" },
          { id: "contact-us", text: "Contact Us", action: "contact" },
        ],
      }
    } else if (lowerInput.includes("thank")) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "You're welcome! Is there anything else I can help you with?",
        timestamp: new Date(),
        buttons: [
          { id: "products-more", text: "Products Information", action: "products" },
          { id: "quote-more", text: "Request a Quote", action: "quote" },
          { id: "contact-more", text: "Contact Us", action: "contact" },
        ],
      }
    } else if (
      lowerInput.includes("human") ||
      lowerInput.includes("person") ||
      lowerInput.includes("agent") ||
      lowerInput.includes("representative")
    ) {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "If you'd like to speak with a human representative, you can schedule a call or send us an email. Our team will get back to you as soon as possible.",
        timestamp: new Date(),
        buttons: [
          {
            id: "schedule-human",
            text: "Schedule a Call",
            action: "custom",
            value: "openCallScheduler",
          },
          {
            id: "email-human",
            text: "Send Email",
            action: "link",
            value: "mailto:euronegoce.mail@gmail.com",
          },
        ],
      }
    } else {
      return {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "Thank you for your message. How can I assist you with Euro Negoce's products or services today?",
        timestamp: new Date(),
        buttons: [
          { id: "products-help", text: "Products Information", action: "products" },
          { id: "quote-help", text: "Request a Quote", action: "quote" },
          { id: "call-help", text: "Schedule a Call", action: "call" },
          { id: "contact-help", text: "Contact Us", action: "contact" },
        ],
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700",
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageSquare size={24} className="text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-40 transition-all duration-300 ease-in-out shadow-xl rounded-lg overflow-hidden",
            isMinimized
              ? "bottom-24 right-6 w-72 h-14"
              : "bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-120px)]",
          )}
        >
          {/* Chat Header */}
          <div className="bg-green-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-medium">Euro Negoce Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-green-700 rounded"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button onClick={toggleChat} className="p-1 hover:bg-green-700 rounded" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-110px)] bg-white">
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      message.type === "user" ? "ml-auto items-end" : "mr-auto items-start",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === "bot" && <Bot size={16} className="text-green-600" />}
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {message.type === "user" && <User size={16} className="text-blue-600" />}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        message.type === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none",
                      )}
                    >
                      {message.text.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    {message.buttons && message.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.buttons.map((button) => (
                          <button
                            key={button.id}
                            onClick={() => handleButtonClick(button)}
                            className="bg-white border border-green-600 text-green-600 hover:bg-green-50 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                          >
                            {button.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-green-600" />
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800 rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={inputValue.trim() === ""}
                    className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  )
}
