import { NextResponse } from "next/server"
import { updateAnalysisResult } from "../conversation-updates/route"

export async function GET() {
  try {
    // Garantir que o cabeçalho Content-Type seja definido como application/json
    const headers = new Headers({
      "Content-Type": "application/json",
      // Adicionar cabeçalhos para evitar cache
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    })

    // Em um cenário real, você buscaria o resultado da análise do serviço Chatlayer
    // Aqui estamos apenas simulando uma resposta

    // Simular um pequeno atraso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const analysisResult = `
      ## Análise da Conversa

      ### Pontos Fortes:
      - O bot respondeu rapidamente à solicitação do usuário
      - A piada foi entregue de forma clara e estruturada
      - O tom da conversa foi amigável e engajador

      ### Áreas para Melhoria:
      - O bot poderia perguntar se o usuário gostou da piada
      - Poderia oferecer contar outra piada ou mudar de assunto
      - Adicionar mais personalidade às respostas

      ### Recomendações:
      1. Implementar follow-up questions após contar piadas
      2. Adicionar mais variedade ao repertório de piadas
      3. Personalizar as respostas com base no histórico do usuário
    `

    return new NextResponse(
      JSON.stringify({
        success: true,
        result: analysisResult,
      }),
      { headers },
    )
  } catch (error) {
    console.error("Erro ao obter resultado da análise:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor" }), {
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
      return new NextResponse(JSON.stringify({ error: "conversationId é obrigatório" }), { status: 400, headers })
    }

    // Se o resultado da análise foi fornecido, use-o
    // Caso contrário, gere um resultado padrão
    const analysisResult =
      data.result ||
      `
      ## Análise da Conversa para ${data.conversationId}

      ### Pontos Fortes:
      - O bot respondeu rapidamente à solicitação do usuário
      - As opções de agendamento foram apresentadas de forma clara
      - O tom da conversa foi profissional e eficiente

      ### Áreas para Melhoria:
      - O bot poderia oferecer mais detalhes sobre os serviços de checkup
      - Poderia confirmar os detalhes do agendamento no final
      - Adicionar opção para receber um lembrete antes do agendamento

      ### Recomendações:
      1. Implementar confirmação final do agendamento
      2. Adicionar mais informações sobre os serviços disponíveis
      3. Oferecer opção de cancelamento ou reagendamento
    `

    // Atualizar o resultado da análise no armazenamento de conversas
    updateAnalysisResult(data.conversationId, analysisResult)

    return new NextResponse(
      JSON.stringify({
        success: true,
        conversationId: data.conversationId,
        result: analysisResult,
      }),
      { headers },
    )
  } catch (error) {
    console.error("Erro ao processar resultado da análise:", error)
    // Garantir que mesmo em caso de erro, retornamos JSON
    return new NextResponse(JSON.stringify({ error: "Erro interno do servidor" }), {
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
