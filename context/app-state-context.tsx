"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { toast } from "sonner"

// Tipos atualizados para mensagens
export type Actor = "bot" | "user"

export interface QuickReply {
  text: string
  payload?: string
  iconName?: string
}

export interface Message {
  actor: Actor
  text: string
  quickReplies?: QuickReply[]
  imageUrl?: string
}

// Tipos de tom do usuário disponíveis
export type UserTone = "polite" | "impatient" | "stressed" | "enthusiastic" | "frustrated" | "confused"

// Define AppStage type
export type AppStage = "initial" | "processing" | "finished" | "error"

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
  // Novos campos
  userTones: UserTone[]
  goal: string
  intents: string
  conversationId: string
  lastUpdated: number
}

interface AppStateContextType {
  state: AppState
  updateState: (newState: Partial<AppState>) => void
  toggleUserTone: (tone: UserTone) => void
  startAnalysis: () => Promise<void>
  resetAnalysis: () => void
  fetchConversationUpdates: () => Promise<void>
  submitAnalysisResult: (result: string) => void
}

// Gerar um ID de conversa inicial
const generateConversationId = () => `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

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
  // Valores iniciais para os novos campos
  userTones: [],
  goal: "",
  intents: "",
  conversationId: generateConversationId(),
  lastUpdated: Date.now(),
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

// Função auxiliar para verificar se uma resposta é JSON
async function safeParseJSON(response: Response) {
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    console.error(`Expected JSON response but got ${contentType}`)
    // Retornar um objeto vazio ou array vazio dependendo do contexto
    return []
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    // Retornar um objeto vazio ou array vazio dependendo do contexto
    return []
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [analysisCheckInterval, setAnalysisCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [apiErrorCount, setApiErrorCount] = useState(0)

  // Função para verificar se há um resultado de análise
  const checkAnalysisResult = useCallback(async () => {
    if (!state.conversationId || state.stage !== "processing") return

    try {
      // Adicionar um parâmetro de timestamp para evitar cache
      const timestamp = Date.now()
      const response = await fetch(
        `/api/conversation-updates?conversationId=${state.conversationId}&checkAnalysis=true&_=${timestamp}`,
        {
          // Adicionar cabeçalhos para evitar cache
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )

      if (!response.ok) {
        console.error(`Error checking analysis result: ${response.status}`)
        setApiErrorCount((prev) => prev + 1)
        return
      }

      // Usar a função auxiliar para analisar JSON com segurança
      const data = await safeParseJSON(response)

      // Se data for um array vazio (erro ao analisar JSON), retornar
      if (Array.isArray(data) && data.length === 0) {
        setApiErrorCount((prev) => prev + 1)
        return
      }

      // Resetar o contador de erros se a resposta for bem-sucedida
      setApiErrorCount(0)

      if (data.analysisCompleted && data.analysisResult) {
        console.log("Analysis completed:", data.analysisResult)

        // Parar o polling e limpar o timeout
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        if (analysisCheckInterval) {
          clearInterval(analysisCheckInterval)
          setAnalysisCheckInterval(null)
        }

        // Atualizar o estado com o resultado da análise
        setState((prev) => ({
          ...prev,
          stage: "finished",
          isLoading: false,
          analysisResult: data.analysisResult,
          lastUpdated: Date.now(),
        }))

        toast.success("Análise concluída com sucesso!")
      }
    } catch (error) {
      console.error("Error checking analysis result:", error)
      setApiErrorCount((prev) => prev + 1)
      // Não propagar o erro para evitar quebrar a UI
    }
  }, [state.conversationId, state.stage, pollingInterval, analysisCheckInterval])

  // Iniciar verificação de análise quando o estado for "processing"
  useEffect(() => {
    if (state.stage === "processing" && !analysisCheckInterval) {
      console.log("Starting analysis check interval")
      const interval = setInterval(checkAnalysisResult, 3000) // Verificar a cada 3 segundos
      setAnalysisCheckInterval(interval)
    } else if (state.stage !== "processing" && analysisCheckInterval) {
      console.log("Stopping analysis check interval")
      clearInterval(analysisCheckInterval)
      setAnalysisCheckInterval(null)
    }

    return () => {
      if (analysisCheckInterval) {
        clearInterval(analysisCheckInterval)
      }
    }
  }, [state.stage, analysisCheckInterval, checkAnalysisResult])

  // Função para buscar atualizações da conversa
  const fetchConversationUpdates = useCallback(async () => {
    if (!state.conversationId) return

    try {
      console.log(`Fetching updates for conversation: ${state.conversationId}`)

      // Adicionar um parâmetro de timestamp para evitar cache
      const timestamp = Date.now()
      const response = await fetch(`/api/conversation-updates?conversationId=${state.conversationId}&_=${timestamp}`, {
        // Adicionar cabeçalhos para evitar cache
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        console.error(`Error fetching conversation: ${response.status}`)
        setApiErrorCount((prev) => prev + 1)
        return
      }

      // Usar a função auxiliar para analisar JSON com segurança
      const messages = await safeParseJSON(response)

      // Se messages for um array vazio (erro ao analisar JSON), retornar
      if (messages.length === 0) {
        // Pode ser um erro ou simplesmente não há mensagens ainda
        console.log("No messages found or error parsing JSON")
        return
      }

      // Resetar o contador de erros se a resposta for bem-sucedida
      setApiErrorCount(0)

      console.log(`Received ${messages.length} messages:`, messages)

      setState((prev) => ({
        ...prev,
        conversation: messages,
        lastUpdated: Date.now(),
      }))

      // Resetar o timeout quando receber atualizações
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Configurar novo timeout de 30 segundos
      if (state.stage === "processing") {
        timeoutRef.current = setTimeout(() => {
          console.log("Timeout: No updates received in 30 seconds")
          setState((prev) => ({
            ...prev,
            stage: "error",
            isLoading: false,
            analysisResult: "Timeout: No updates received in 30 seconds",
          }))

          if (pollingInterval) {
            clearInterval(pollingInterval)
            setPollingInterval(null)
          }

          if (analysisCheckInterval) {
            clearInterval(analysisCheckInterval)
            setAnalysisCheckInterval(null)
          }

          toast.error("Timeout: No updates received in 30 seconds")
        }, 30000)
      }
    } catch (error) {
      console.error("Error fetching conversation updates:", error)
      setApiErrorCount((prev) => prev + 1)
      // Não propagar o erro para evitar quebrar a UI
    }
  }, [state.conversationId, state.stage, pollingInterval, analysisCheckInterval])

  // Efeito para lidar com muitos erros de API consecutivos
  useEffect(() => {
    if (apiErrorCount >= 5) {
      console.error("Too many API errors, stopping polling")

      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }

      if (analysisCheckInterval) {
        clearInterval(analysisCheckInterval)
        setAnalysisCheckInterval(null)
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      setState((prev) => ({
        ...prev,
        stage: "error",
        isLoading: false,
        analysisResult: "Erro de comunicação com o servidor. Por favor, tente novamente mais tarde.",
      }))

      toast.error("Erro de comunicação com o servidor")
      setApiErrorCount(0)
    }
  }, [apiErrorCount, pollingInterval, analysisCheckInterval])

  // Iniciar polling quando o estado for "processing"
  useEffect(() => {
    if (state.stage === "processing" && !pollingInterval) {
      console.log("Starting polling for conversation updates")
      const interval = setInterval(fetchConversationUpdates, 2000) // Polling a cada 2 segundos
      setPollingInterval(interval)

      // Fazer uma busca inicial imediatamente
      fetchConversationUpdates()

      // Configurar timeout inicial
      timeoutRef.current = setTimeout(() => {
        console.log("Timeout: No updates received in 30 seconds")
        setState((prev) => ({
          ...prev,
          stage: "error",
          isLoading: false,
          analysisResult: "Timeout: No updates received in 30 seconds",
        }))

        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }

        if (analysisCheckInterval) {
          clearInterval(analysisCheckInterval)
          setAnalysisCheckInterval(null)
        }

        toast.error("Timeout: No updates received in 30 seconds")
      }, 30000)
    } else if (state.stage !== "processing" && pollingInterval) {
      console.log("Stopping polling for conversation updates")
      clearInterval(pollingInterval)
      setPollingInterval(null)

      // Limpar o timeout quando o estado não for mais "processing"
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [state.stage, pollingInterval, fetchConversationUpdates])

  // Forçar uma atualização quando o conversationId mudar
  useEffect(() => {
    if (state.conversationId) {
      fetchConversationUpdates()
    }
  }, [state.conversationId, fetchConversationUpdates])

  const updateState = (newState: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...newState }))
  }

  // Função para alternar a seleção de um tom de usuário
  const toggleUserTone = (tone: UserTone) => {
    setState((prev) => {
      // Se o tom já está selecionado, remova-o
      if (prev.userTones.includes(tone)) {
        return {
          ...prev,
          userTones: prev.userTones.filter((t) => t !== tone),
        }
      }

      // Se já temos 4 tons selecionados, não adicione mais
      if (prev.userTones.length >= 4) {
        toast.warning("Maximum 4 user tones can be selected")
        return prev
      }

      // Caso contrário, adicione o tom
      return {
        ...prev,
        userTones: [...prev.userTones, tone],
      }
    })
  }

  // Função para submeter o resultado da análise
  const submitAnalysisResult = (result: string) => {
    // Parar o polling e limpar o timeout
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (analysisCheckInterval) {
      clearInterval(analysisCheckInterval)
      setAnalysisCheckInterval(null)
    }

    // Atualizar o estado com o resultado da análise
    setState((prev) => ({
      ...prev,
      stage: "finished",
      isLoading: false,
      analysisResult: result,
    }))

    toast.success("Análise concluída com sucesso!")
  }

  const startAnalysis = async () => {
    // Validar campos obrigatórios
    if (!state.botId || !state.token || !state.endpoint) {
      toast.error("Please fill in all credential fields")
      return
    }

    try {
      // NÃO gerar um novo ID de conversa, usar o existente
      const currentConversationId = state.conversationId
      console.log(`Starting analysis with existing conversation ID: ${currentConversationId}`)

      // Limpar mensagens da conversa no backend
      try {
        await fetch(`/api/conversation-updates?conversationId=${currentConversationId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error clearing conversation:", error)
        // Continuar mesmo se houver erro ao limpar
      }

      // Limpar o histórico de conversas e atualizar estado para processamento
      updateState({
        stage: "processing",
        isLoading: true,
        conversation: [],
        analysisResult: "",
      })

      // Construir o objeto JSON conforme especificado
      const requestBody = {
        message: {
          textMessage: {
            text: "Start Conversation",
          },
        },
        conversationId: currentConversationId,
        user: {
          id: currentConversationId,
          firstName: "chatlayer_analyzer_test",
        },
        sessionData: {
          target_bot: {
            webhook_url: state.endpoint,
            bearerToken: state.token,
            bot_id: state.botId,
          },
          promptData: {
            intents: state.intents
              .split(",")
              .map((intent) => intent.trim())
              .filter((intent) => intent),
            user_tone: state.userTones,
            user_persona: state.humanDescription,
            conversationalFlows: state.goal,
            bot_function: state.botDescription,
          },
        },
      }

      // Enviar dados para o backend
      const response = await fetch("/api/start-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start analysis")
      }

      toast.success("Analysis started successfully!")

      // Comentado: não adicionar mais mensagens de exemplo
      // await addExampleMessages(currentConversationId)
    } catch (error) {
      console.error("Error starting analysis:", error)
      toast.error(`Error starting analysis: ${error instanceof Error ? error.message : "Unknown error"}`)
      updateState({
        stage: "error",
        isLoading: false,
        analysisResult: "Error starting analysis. Please try again.",
      })
    }
  }

  const resetAnalysis = () => {
    // Gerar um novo ID de conversa apenas quando resetar
    const newConversationId = generateConversationId()

    // Manter as credenciais e descrições, mas resetar o resto
    setState((prev) => ({
      ...prev,
      stage: "initial",
      conversation: [],
      analysisResult: "",
      isLoading: false,
      conversationId: newConversationId,
    }))
    toast("Analysis reset with new conversation ID")
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        updateState,
        toggleUserTone,
        startAnalysis,
        resetAnalysis,
        fetchConversationUpdates,
        submitAnalysisResult,
      }}
    >
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
