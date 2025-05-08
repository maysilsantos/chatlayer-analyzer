import { NextResponse } from "next/server"
const chatlayerAnalyzerUrl = "https://api.staging.europe-west1.gc.chatlayer.ai/v1/channels/webhook/681b7a616c7f1acf71e54199/messages";

export async function POST(request: Request) {
  try {
    const requestData = await request.json()

    // Validar dados recebidos
    if (
      !requestData.sessionData?.target_bot?.webhook_url ||
      !requestData.sessionData?.target_bot?.bearerToken ||
      !requestData.sessionData?.target_bot?.bot_id
    ) {
      return NextResponse.json({ error: "Missing required fields in target_bot" }, { status: 400 })
    }

    // Extrair dados do target_bot
    const { webhook_url, bearerToken, bot_id } = requestData.sessionData.target_bot

    // Construir o corpo da requisição para o webhook externo
    const webhookBody = {
      ...requestData,
    }

    console.log("Sending request to webhook:", chatlayerAnalyzerUrl)
    console.log("Request body:", JSON.stringify(webhookBody, null, 2))

    // Enviar requisição para o webhook externo
    try {
      const webhookResponse = await fetch(chatlayerAnalyzerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(webhookBody),
      })

      // Verificar se a resposta foi bem-sucedida
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text()
        console.error("Webhook error:", errorText)
        return NextResponse.json(
          {
            error: `Webhook returned status ${webhookResponse.status}`,
            details: errorText,
          },
          { status: webhookResponse.status },
        )
      }

      const responseData = await webhookResponse.json()

      return NextResponse.json({
        success: true,
        message: "Analysis started successfully",
        webhookResponse: responseData,
      })
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError)
      return NextResponse.json(
        {
          error: "Error calling webhook",
          details: webhookError instanceof Error ? webhookError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
