"use client"

import { useAppState } from "@/context/app-state-context"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorStage() {
  const { state, resetState } = useAppState()
  const { data } = state

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border rounded-lg shadow-sm border-red-200 bg-red-50">
      <AlertTriangle className="h-16 w-16 text-red-500" />
      <h2 className="text-2xl font-bold text-red-700">Erro</h2>

      <p className="text-center text-red-600">{data.error || "Ocorreu um erro ao processar sua solicitação."}</p>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => resetState()}>
          Voltar ao Início
        </Button>
        <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
      </div>
    </div>
  )
}
