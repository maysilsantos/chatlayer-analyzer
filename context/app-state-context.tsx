"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { toast } from "sonner"

// Tipos para a aplicação
export type AppStage = "initial" | "processing" | "finished"
export type Actor = "bot" | "user"

export interface Message {
  actor: Actor
  text: string
}

interface AppState {
  stage: AppStage
  botId: string
  token: string
  endpoint: string
  humanDescription: string
  botDescription: string
  conversation: Message[]
  analysisResult: string
  isLoading: boolean
}

interface AppStateContextType {
  state: AppState
  updateState: (newState: Partial<AppState>) => void
  startAnalysis: () => Promise<void>
  resetAnalysis: () => void
}

const initialState: AppState = {
  stage: "initial",
  botId: "",
  token: "",
  endpoint: "",
  humanDescription: "",
  botDescription: "",
  conversation: [],
  analysisResult: "",
  isLoading: false,
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const updateState = (newState: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...newState }))
  }

  const startAnalysis = async () => {
    // Validar campos obrigatórios
    if (!state.botId || !state.token || !state.endpoint) {
      toast.error("Por favor, preencha todos os campos de credenciais")
      return
    }

    try {
      // Atualizar estado para processamento
      updateState({
        stage: "processing",
        isLoading: true,
        conversation: [],
        analysisResult: "",
      })

      // Enviar dados para o backend
      const response = await fetch("/api/start-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botId: state.botId,
          token: state.token,
          endpoint: state.endpoint,
          humanDescription: state.humanDescription,
          botDescription: state.botDescription,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao iniciar análise")
      }

      toast.success("Análise iniciada com sucesso")

      // Iniciar polling para obter atualizações da conversa
      startConversationPolling()
    } catch (error) {
      console.error("Erro ao iniciar análise:", error)
      toast.error("Erro ao iniciar análise. Por favor, tente novamente.")
      updateState({
        stage: "initial",
        isLoading: false,
        analysisResult: "Erro ao iniciar análise. Por favor, tente novamente.",
      })
    }
  }

  const startConversationPolling = () => {
    // Simulação de polling para obter atualizações da conversa
    // Em um cenário real, você usaria SSE, WebSockets ou polling real

    // Exemplo de conversa simulada
    const mockConversation: Message[] = [
      { actor: "bot", text: "How can I help you today?" },
      { actor: "user", text: "Tell me a funny joke" },
      { actor: "bot", text: "Sure, here's a classic one for you:" },
      { actor: "bot", text: "Why don't scientists trust atoms?" },
      { actor: "bot", text: "Because they make up everything!" },
    ]

    let index = 0

    // Adicionar mensagens gradualmente para simular recebimento em tempo real
    const intervalId = setInterval(() => {
      if (index < mockConversation.length) {
        updateState({
          conversation: [...state.conversation, mockConversation[index]],
        })
        index++
      } else {
        // Quando todas as mensagens forem adicionadas, finalizar a análise
        clearInterval(intervalId)
        finishAnalysis()
      }
    }, 1000)
  }

  const finishAnalysis = async () => {
    try {
      // Simular chamada para obter o resultado da análise
      const response = await fetch("/api/get-analysis-result", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Falha ao obter resultado da análise")
      }

      const data = await response.json()

      // Atualizar estado com o resultado da análise
      updateState({
        stage: "finished",
        isLoading: false,
        analysisResult: data.result,
      })

      toast.success("Análise concluída com sucesso!")
    } catch (error) {
      console.error("Erro ao obter resultado da análise:", error)
      toast.error("Erro ao obter resultado da análise")
      updateState({
        stage: "finished",
        isLoading: false,
        analysisResult: "Erro ao obter resultado da análise. Por favor, tente novamente.",
      })
    }
  }

  const resetAnalysis = () => {
    // Manter as credenciais e descrições, mas resetar o resto
    setState((prev) => ({
      ...prev,
      stage: "initial",
      conversation: [],
      analysisResult: "",
      isLoading: false,
    }))
    toast("Análise reiniciada")
  }

  return (
    <AppStateContext.Provider value={{ state, updateState, startAnalysis, resetAnalysis }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
