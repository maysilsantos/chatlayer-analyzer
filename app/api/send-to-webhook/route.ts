import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const dataToSend = await request.json()

    const webhookUrl = "https://webhook.site/07afed53-a7f4-4438-986e-a18929f37808"

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })

    const responseData = await response.text()

    return NextResponse.json({
      message: "Dados enviados com sucesso para o Webhook.site",
      webhookResponse: responseData,
    })
  } catch (error: any) {
    console.error("Erro ao enviar para o Webhook.site:", error)

    return NextResponse.json({ message: "Erro ao enviar dados", error: error.message }, { status: 500 })
  }
}
