import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Obter os dados do corpo da requisição
    const data = await request.json()

    // Validar os dados
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Simular processamento de dados
    // Em um caso real, você poderia salvar em um banco de dados aqui
    const result = {
      id: `req_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: "success",
      data: {
        name: data.name,
        email: data.email,
      },
    }

    // Simular um pequeno atraso para demonstrar o estágio de processamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao processar submissão:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
