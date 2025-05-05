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
      toast.error("Please fill in all credential fields")
      return
    }

    try {
      // MODIFICAÇÃO AQUI: Limpar explicitamente o histórico de conversas
      // Atualizar estado para processamento e limpar conversas anteriores
      updateState({
        stage: "processing",
        isLoading: true,
        conversation: [], // Garantir que o histórico está vazio
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
        throw new Error("Failed to start analysis")
      }

      toast.success("Analysis started successfully!")

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
    // MODIFICAÇÃO AQUI: Criar uma nova variável local para armazenar as mensagens
    // para evitar problemas de closure com o estado anterior
    const newConversation: Message[] = []
    
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
        // Adicionar a nova mensagem ao array local
        newConversation.push(mockConversation[index])
        
        // Atualizar o estado com o array completo de mensagens até agora
        updateState({
          conversation: [...newConversation],
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
        throw new Error("Failure to obtain analysis results")
      }

      const data = await response.json()

      // Atualizar estado com o resultado da análise
      updateState({
        stage: "finished",
        isLoading: false,
        analysisResult: data.result,
      })

      toast.success("Analysis started successfully!")
    } catch (error) {
      console.error("Error obtaining analysis result:", error)
      toast.error("Error obtaining analysis result")
      updateState({
        stage: "finished",
        isLoading: false,
        analysisResult: "Error obtaining analysis result. Please try again.",
      })
    }
  }

  const resetAnalysis = () => {
    // MODIFICAÇÃO AQUI: Garantir que o histórico de conversas seja limpo
    setState((prev) => ({
      ...prev,
      stage: "initial",
      conversation: [], // Limpar explicitamente o histórico
      analysisResult: "",
      isLoading: false,
    }))
    toast("Analysis restarted")
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