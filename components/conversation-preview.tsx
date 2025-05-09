"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import type { Message } from "@/context/app-state-context"
import { Check, Calendar } from "lucide-react"

interface ConversationPreviewProps {
  conversation: Message[]
}

// Mapeamento de nomes de ícones para componentes Lucide
const iconMap: Record<string, React.ReactNode> = {
  check: <Check className="h-4 w-4 mr-1" />,
  calendar: <Calendar className="h-4 w-4 mr-1" />,
}

export default function ConversationPreview({ conversation }: ConversationPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // Manter um estado local estável das mensagens
  const [stableConversation, setStableConversation] = useState<Message[]>([])

  // Atualizar o estado local apenas quando novas mensagens forem adicionadas
  useEffect(() => {
    if (conversation.length > 0) {
      // Verificar se há novas mensagens para adicionar
      const newMessages = conversation.filter(
        (msg, index) =>
          // Verificar se a mensagem já existe no stableConversation
          !stableConversation.some(
            (stableMsg, stableIndex) =>
              stableMsg.text === msg.text && stableMsg.actor === msg.actor && stableIndex === index,
          ),
      )

      if (newMessages.length > 0) {
        console.log("Adicionando novas mensagens ao stableConversation:", newMessages)
        // Apenas adicionar novas mensagens, não substituir tudo
        setStableConversation((prev) => {
          // Se o tamanho da conversa mudou drasticamente, pode ser uma nova conversa
          if (Math.abs(prev.length - conversation.length) > 3) {
            return conversation
          }
          // Caso contrário, manter as mensagens existentes e adicionar as novas
          return [...prev, ...newMessages]
        })
      }
    } else if (conversation.length === 0 && stableConversation.length > 0) {
      // Limpar apenas se a conversa estiver vazia e tínhamos mensagens antes
      // Isso indica uma mudança para uma nova conversa
      setStableConversation([])
    }
  }, [conversation, stableConversation])

  // Rolar para o final quando novas mensagens forem adicionadas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [stableConversation])

  // Adicionar log para depuração
  useEffect(() => {
    console.log("ConversationPreview rendering with stable messages:", stableConversation)
  }, [stableConversation])

  // Usar stableConversation em vez de conversation
  const displayConversation = stableConversation.length > 0 ? stableConversation : conversation

  return (
    <div ref={scrollRef} className="bg-cream-50 rounded-md h-[400px] overflow-y-auto p-4 border border-gray-200">
      {displayConversation.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          Waiting for conversation to begin...
        </div>
      ) : (
        <div className="space-y-4">
          {displayConversation.map((message, index) => (
            <div
              key={`msg-${index}-${message.actor}-${message.text.substring(0, 10)}`}
              className={`flex ${message.actor === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.actor === "user" ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {/* Título da mensagem baseado no actor */}
                {message.actor === "bot" ? (
                  <div className="font-semibold text-xs mb-1">QA Test Bot - LLM Generated</div>
                ) : (
                  <div className="font-semibold text-xs mb-1">Target Bot – Developed with the Chatlayer platform.</div>
                )}

                {/* Texto da mensagem */}
                <p>{message.text}</p>

                {/* Imagem, se houver */}
                {message.imageUrl && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <Image
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Message attachment"
                      width={250}
                      height={150}
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Botões de resposta rápida, se houver */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.quickReplies.map((reply, replyIndex) => (
                      <button
                        key={replyIndex}
                        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {reply.iconName && iconMap[reply.iconName]}
                        {reply.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Nota de rodapé para mensagens do bot */}
                {message.actor === "bot" && (
                  <div className="text-xs mt-1 text-blue-600">
                    This is a response generated by an LLM simulating human behavior.
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
