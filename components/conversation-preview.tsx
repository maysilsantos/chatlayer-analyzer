"use client"

import { useRef, useEffect } from "react"
import type { Message } from "@/context/app-state-context"

interface ConversationPreviewProps {
  conversation: Message[]
}

export default function ConversationPreview({ conversation }: ConversationPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Rolar para o final quando novas mensagens forem adicionadas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <div ref={scrollRef} className="bg-cream-50 rounded-md h-[400px] overflow-y-auto p-4 border border-gray-200">
      {conversation.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          Waiting for conversation to begin...
        </div>
      ) : (
        <div className="space-y-4">
          {conversation.map((message, index) => (
            <div key={index} className={`flex ${message.actor === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.actor === "user" ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {message.actor === "bot" && <div className="font-semibold text-xs mb-1">Zapbot</div>}
                <p>{message.text}</p>
                {message.actor === "bot" && (
                  <div className="text-xs mt-1 text-blue-600">
                    This is an automated chatbot response. <span className="underline">Learn more</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
