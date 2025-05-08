export async function submitFormData(data: { name: string; email: string }) {
  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Falha na requisição")
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao enviar dados:", error)
    throw error
  }
}

export async function updateAppState(stage: string, data?: Record<string, any>) {
  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stage, data }),
    })

    if (!response.ok) {
      throw new Error("Falha ao atualizar estado")
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar estado:", error)
    throw error
  }
}

export async function getAppState() {
  try {
    const response = await fetch("/api/state")

    if (!response.ok) {
      throw new Error("Falha ao obter estado")
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao obter estado:", error)
    throw error
  }
}
