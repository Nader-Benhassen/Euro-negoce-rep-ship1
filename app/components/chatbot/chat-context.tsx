"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ChatContextType = {
  openQuoteModal: () => void
  openContactModal: () => void
  openCallScheduler: () => void
  openProductsModal: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const openQuoteModal = () => {
    if (isClient) {
      const event = new CustomEvent("openQuoteModal")
      window.dispatchEvent(event)
    }
  }

  const openContactModal = () => {
    if (isClient) {
      const event = new CustomEvent("openContactModal")
      window.dispatchEvent(event)
    }
  }

  const openCallScheduler = () => {
    if (isClient) {
      const event = new CustomEvent("openCallScheduler")
      window.dispatchEvent(event)
    }
  }

  const openProductsModal = () => {
    if (isClient) {
      const event = new CustomEvent("openProductsModal")
      window.dispatchEvent(event)
    }
  }

  return (
    <ChatContext.Provider value={{ openQuoteModal, openContactModal, openCallScheduler, openProductsModal }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
