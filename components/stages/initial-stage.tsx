"use client"

import { useAppState } from "@/context/app-state-context"
import { Button } from "@/components/ui/button"

export default function InitialStage() {
  const { updateStage } = useAppState()

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold">Bem-vindo à Aplicação</h2>
      <p className="text-center max-w-md">
        Esta é uma aplicação de página única (SPA) construída com Next.js. Clique no botão abaixo para começar.
      </p>
      <Button size="lg" onClick={() => updateStage("form")}>
        Começar
      </Button>
    </div>
  )
}
