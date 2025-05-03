"use client"

import { useAppState } from "@/context/app-state-context"
import InitialStage from "./stages/initial-stage"
import FormStage from "./stages/form-stage"
import ProcessingStage from "./stages/processing-stage"
import ResultStage from "./stages/result-stage"
import ErrorStage from "./stages/error-stage"

export default function MainApp() {
  const { state } = useAppState()

  // Renderiza o componente apropriado com base no estágio atual
  const renderStage = () => {
    switch (state.currentStage) {
      case "initial":
        return <InitialStage />
      case "form":
        return <FormStage />
      case "processing":
        return <ProcessingStage />
      case "result":
        return <ResultStage />
      case "error":
        return <ErrorStage />
      default:
        return <InitialStage />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Minha Aplicação SPA</h1>
        <p className="text-muted-foreground">Estágio atual: {state.currentStage}</p>
      </header>

      <div className="flex-1">{renderStage()}</div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Minha Aplicação SPA
      </footer>
    </div>
  )
}
