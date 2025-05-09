import { NextResponse, type NextRequest } from "next/server"
import type { Message } from "@/context/app-state-context"
import { getMockConversation, getMockAnalysisResult } from "@/lib/mock-conversation"

// Tempo de expiração em milissegundos (5 minutos por padrão)
const EXPIRATION_TIME = 5 * 60 * 1000

// Estrutura para armazenar conversas com timestamp
interface ConversationData {
  messages: Message[]
  lastUpdated: number
  analysisResult?: string
  analysisCompleted?: boolean
}

// Armazenar conversas por ID
interface ConversationStore {
  [conversationId: string]: ConversationData
}

// Em um cenário real, você usaria um banco de dados ou Redis
// para armazenar as mensagens. Aqui usamos uma variável em memória
// apenas para demonstração.
const conversations: ConversationStore = {}

// Função para limpar conversas expiradas
function cleanupExpiredConversations() {
  const now = Date.now()
  let cleanedCount = 0

  Object.keys(conversations).forEach((id) => {
    if (now - conversations[id].lastUpdated > EXPIRATION_TIME) {
      delete conversations[id]
      cleanedCount++
    }
  })

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired conversations`)
  }

  return cleanedCount
}

// Executar limpeza a cada hora
setInterval(cleanupExpiredConversations, 60 * 60 * 1000)

export async function GET(request: NextRequest) {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    // Limpar conversas expiradas antes de processar a solicitação
    cleanupExpiredConversations()

    const url = new URL(request.url)
    const conversationId = url.searchParams.get("conversationId")
    const checkAnalysis = url.searchParams.get("checkAnalysis") === "true"

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required as query parameter" }, { status: 400, headers })
    }

    // Inicializar a conversa se não existir
    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        messages: [],
        lastUpdated: Date.now(),
      }
    }

    // Usar dados mockados em vez de dados reais
    if (checkAnalysis) {
      // Se estamos verificando a análise, retornar informações sobre a análise
      return NextResponse.json(
        {
          analysisCompleted: true,
          analysisResult: getMockAnalysisResult(),
        },
        { headers },
      )
    } else {
      // Retornar a conversa mockada
      const mockMessages = getMockConversation(conversationId)

      // Simular carregamento progressivo das mensagens
      // Calcular quantas mensagens mostrar com base no tempo desde a criação da conversa
      const conversation = conversations[conversationId]
      const now = Date.now()
      const timeElapsed = conversation ? now - conversation.lastUpdated : 0

      // Mostrar uma nova mensagem a cada 2 segundos (aproximadamente)
      const messagesToShow = Math.min(mockMessages.length, Math.floor(timeElapsed / 2000) + 1)

      return NextResponse.json(mockMessages.slice(0, messagesToShow), { headers })
    }
  } catch (error) {
    console.error("Error processing GET request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Invalid request format" },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    const data = await request.json()

    // Validar os dados
    if (!data.conversationId) {
      return NextResponse.json({ error: "conversationId is required" }, { status: 400, headers })
    }

    // Inicializar ou atualizar o objeto de conversa para este conversationId
    if (!conversations[data.conversationId]) {
      conversations[data.conversationId] = {
        messages: [],
        lastUpdated: Date.now(),
      }
    } else {
      // Apenas atualizar o timestamp
      conversations[data.conversationId].lastUpdated = Date.now()
    }

    // Retornar sucesso - não adicionamos mensagens reais, usamos o mock
    return NextResponse.json(
      {
        success: true,
        message: "Conversation updated",
        expiresAt: new Date(conversations[data.conversationId].lastUpdated + EXPIRATION_TIME).toISOString(),
      },
      { headers },
    )
  } catch (error) {
    console.error("Error updating conversation:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    const url = new URL(request.url)
    const conversationId = url.searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required as query parameter" }, { status: 400, headers })
    }

    // Resetar a conversa específica
    conversations[conversationId] = {
      messages: [],
      lastUpdated: Date.now(),
      analysisCompleted: false,
      analysisResult: "",
    }

    return NextResponse.json(
      {
        success: true,
        message: `Conversation ${conversationId} cleared`,
      },
      { headers },
    )
  } catch (error) {
    console.error("Error processing DELETE request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Invalid request format" },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

// Endpoint adicional para obter estatísticas sobre as conversas armazenadas
export async function OPTIONS(request: Request) {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    // Limpar conversas expiradas antes de retornar estatísticas
    const cleanedCount = cleanupExpiredConversations()

    const totalConversations = Object.keys(conversations).length
    const oldestConversation =
      Object.values(conversations).length > 0
        ? Math.min(...Object.values(conversations).map((c) => c.lastUpdated))
        : null

    const stats = {
      totalConversations,
      oldestConversation: oldestConversation ? new Date(oldestConversation).toISOString() : null,
      expirationTimeHours: EXPIRATION_TIME / (60 * 60 * 1000),
      cleanedInLastRun: cleanedCount,
    }

    return NextResponse.json(stats, { headers })
  } catch (error) {
    console.error("Error processing OPTIONS request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Error getting statistics" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

// Função para atualizar o resultado da análise
export function updateAnalysisResult(conversationId: string, result: string) {
  if (!conversations[conversationId]) {
    // Se a conversa não existir, crie-a
    conversations[conversationId] = {
      messages: [],
      lastUpdated: Date.now(),
      analysisResult: result,
      analysisCompleted: true,
    }
    return true
  }

  // Se a conversa existir, atualize-a
  conversations[conversationId].analysisResult = result
  conversations[conversationId].analysisCompleted = true
  conversations[conversationId].lastUpdated = Date.now()
  return true
}
