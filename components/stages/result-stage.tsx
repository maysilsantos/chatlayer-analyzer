"use client"

import { useAppState } from "@/context/app-state-context"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ResultStage() {
  const { state, resetState } = useAppState()
  const { data } = state

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border rounded-lg shadow-sm">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h2 className="text-2xl font-bold">Solicitação Concluída</h2>

      <div className="bg-muted p-4 rounded-md w-full max-w-md">
        <p>
          <strong>Nome:</strong> {data.name}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        {data.result && (
          <p className="mt-2">
            <strong>ID da Solicitação:</strong> {data.result.id}
          </p>
        )}
      </div>

      <Button onClick={resetState}>Iniciar Novamente</Button>
    </div>
  )
}
