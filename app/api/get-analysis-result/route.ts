import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Em um cenário real, você buscaria o resultado da análise do serviço Chatlayer
    // Aqui estamos apenas simulando uma resposta

    // Simular um pequeno atraso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const analysisResult = `
    ## Conversation Analysis

      ### Strengths:
      - The bot responded quickly to the user's request
      - The joke was delivered clearly and with structure
      - The tone of the conversation was friendly and engaging

      ### Areas for Improvement:
      - The bot could ask if the user liked the joke
      - It could offer to tell another joke or change the subject
      - Add more personality to the responses

      ### Recommendations:
      1. Implement follow-up questions after telling jokes
      2. Add more variety to the joke repertoire
      3. Personalize responses based on the user's history
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
