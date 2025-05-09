import { NextResponse, type NextRequest } from "next/server"
import type { Message } from "@/context/app-state-context"

// Tempo de expiração em milissegundos (5 minutos por padrão)
const EXPIRATION_TIME = 60 * 60 * 1000

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
      return new NextResponse(JSON.stringify({ error: "conversationId is required as query parameter" }), {
        status: 400,
        headers,
      })
    }

    // Retornar a conversa específica ou um array vazio se não existir
    const conversation = conversations[conversationId]

    if (checkAnalysis) {
      // Se estamos verificando a análise, retornar informações sobre a análise
      return new NextResponse(
        JSON.stringify({
          analysisCompleted: conversation?.analysisCompleted || false,
          analysisResult: conversation?.analysisResult || "",
        }),
        { headers },
      )
    } else {
      // Caso contrário, retornar as mensagens da conversa
      return new NextResponse(JSON.stringify(conversation ? conversation.messages : []), { headers })
    }
  } catch (error) {
    console.error("Error processing GET request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Invalid request format" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
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
    if (!data.message || !data.actor || !data.conversationId) {
      return new NextResponse(
        JSON.stringify({
          error: "Message, actor, and conversationId are required",
        }),
        { status: 400, headers },
      )
    }

    // Criar uma nova mensagem
    const newMessage: Message = {
      actor: data.actor,
      text: data.message,
      quickReplies: data.quickReplies || [],
      imageUrl: data.imageUrl,
    }

    // Inicializar o objeto de conversa para este conversationId se não existir
    if (!conversations[data.conversationId]) {
      conversations[data.conversationId] = {
        messages: [],
        lastUpdated: Date.now(),
      }
    }

    // Verificar se a mensagem já existe para evitar duplicatas
    // const isDuplicate = conversations[data.conversationId].messages.some(
    //   (msg) => msg.text === newMessage.text && msg.actor === newMessage.actor,
    // )

    const isDuplicate = false;

    if (!isDuplicate) {
      // Adicionar a mensagem à conversa específica
      conversations[data.conversationId].messages.push(newMessage)
      // Atualizar o timestamp
      conversations[data.conversationId].lastUpdated = Date.now()
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: isDuplicate ? "Message already exists" : "Message added to conversation",
        conversation: conversations[data.conversationId].messages,
        expiresAt: new Date(conversations[data.conversationId].lastUpdated + EXPIRATION_TIME).toISOString(),
      }),
      { headers },
    )
  } catch (error) {
    console.error("Error updating conversation:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
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
      return new NextResponse(JSON.stringify({ error: "conversationId is required as query parameter" }), {
        status: 400,
        headers,
      })
    }

    // Limpar a conversa específica
    if (conversations[conversationId]) {
      // Manter o objeto da conversa, mas limpar as mensagens
      conversations[conversationId].messages = []
      conversations[conversationId].lastUpdated = Date.now()
      conversations[conversationId].analysisCompleted = false
      conversations[conversationId].analysisResult = ""
    } else {
      // Se a conversa não existir, criar uma nova vazia
      conversations[conversationId] = {
        messages: [],
        lastUpdated: Date.now(),
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Conversation ${conversationId} cleared`,
      }),
      { headers },
    )
  } catch (error) {
    console.error("Error processing DELETE request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Invalid request format" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
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
      expirationTimeHours: EXPIRATION_TIME / (5 * 60 * 1000),
      cleanedInLastRun: cleanedCount,
    }

    return new NextResponse(JSON.stringify(stats), { headers })
  } catch (error) {
    console.error("Error processing OPTIONS request:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Error getting statistics" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
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
