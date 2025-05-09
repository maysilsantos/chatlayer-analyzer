import { NextResponse } from "next/server"
import { updateAnalysisResult } from "../conversation-updates/route"
import { getMockAnalysisResult } from "@/lib/mock-conversation"

export async function GET(request: Request) {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    // Obter o conversationId da URL, se fornecido
    const url = new URL(request.url)
    const conversationId = url.searchParams.get("conversationId")

    // Simular um pequeno atraso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Usar o resultado de análise mockado
    const analysisResult = getMockAnalysisResult()

    // Se um conversationId foi fornecido, atualizar o resultado da análise
    if (conversationId) {
      updateAnalysisResult(conversationId, analysisResult)
    }

    return NextResponse.json(
      {
        success: true,
        result: analysisResult,
      },
      { headers },
    )
  } catch (error) {
    console.error("Erro ao obter resultado da análise:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Erro interno do servidor" },
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
      return NextResponse.json({ error: "conversationId é obrigatório" }, { status: 400, headers })
    }

    // Usar o resultado de análise mockado
    const analysisResult = getMockAnalysisResult()

    // Atualizar o resultado da análise no armazenamento de conversas
    updateAnalysisResult(data.conversationId, analysisResult)

    return NextResponse.json(
      {
        success: true,
        conversationId: data.conversationId,
        result: analysisResult,
      },
      { headers },
    )
  } catch (error) {
    console.error("Erro ao processar resultado da análise:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return NextResponse.json(
      { error: "Erro interno do servidor" },
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
