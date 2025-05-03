import { NextResponse } from "next/server"

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      result: analysisResult,
    })
  } catch (error) {
    console.error("Erro ao obter resultado da análise:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
