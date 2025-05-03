import { NextResponse } from "next/server"

// Em uma aplicação real, você usaria um banco de dados ou Redis
// para armazenar o estado. Aqui usamos uma variável em memória
// apenas para demonstração.
let appState = {
  currentStage: "initial",
  data: {},
  lastUpdated: new Date().toISOString(),
}

export async function GET() {
  return NextResponse.json(appState)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar os dados
    if (!data.stage) {
      return NextResponse.json({ error: "O estágio é obrigatório" }, { status: 400 })
    }

    // Atualizar o estado
    appState = {
      currentStage: data.stage,
      data: data.data || appState.data,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(appState)
  } catch (error) {
    console.error("Erro ao atualizar estado:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
