"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

const ChatBot = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([])
  const [inputText, setInputText] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const sendMessage = () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { text: inputText, sender: "user" }])
      // Simulate bot response
      setTimeout(() => {
        const botResponse = getBotResponse(inputText)
        setMessages([...messages, { text: inputText, sender: "user" }, { text: botResponse, sender: "bot" }])
      }, 500)
      setInputText("")
    }
  }

  const getBotResponse = (userMessage: string): string => {
    userMessage = userMessage.toLowerCase()

    if (userMessage.includes("hello") || userMessage.includes("hi")) {
      return "Hello! How can I help you today?"
    } else if (userMessage.includes("how are you")) {
      return "I am doing well, thank you for asking!"
    } else if (userMessage.includes("contact")) {
      return "You can contact us at euronegoce.mail@gmail.com"
    } else if (userMessage.includes("services")) {
      return "We offer a wide range of services including consulting, trading, and logistics."
    } else if (userMessage.includes("thank you") || userMessage.includes("thanks")) {
      return "You're welcome!"
    } else {
      return "I'm sorry, I don't understand. Please ask something else or contact us at euronegoce.mail@gmail.com for further assistance."
    }
  }

  return (
    <div className="flex flex-col h-96 border rounded-md shadow-md">
      <div className="bg-gray-100 p-3 font-semibold">Chatbot</div>
      <div ref={chatContainerRef} className="flex-grow p-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${message.sender === "user" ? "bg-blue-200" : "bg-gray-200"}`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded-l-md py-2 px-3 focus:outline-none"
            placeholder="Type your message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
