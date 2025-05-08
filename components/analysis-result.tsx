"use client"

import type { AppStage } from "@/context/app-state-context"

interface AnalysisResultProps {
  stage: AppStage
  result: string
}

export default function AnalysisResult({ stage, result }: AnalysisResultProps) {
  return (
    <div className="bg-cream-50 rounded-md h-[200px] overflow-y-auto p-4 border border-gray-200">
      {stage === "initial" && (
        <div className="h-full flex items-center justify-center text-gray-400">
          Waiting for the conversation begins!
        </div>
      )}

      {stage === "processing" && (
        <div className="h-full flex items-center justify-center text-gray-400">
          <span className="flex items-center">🧠 Analyzing conversation...</span>
        </div>
      )}

      {stage === "error" && (
        <div className="h-full flex items-center justify-center text-red-500">
          <span className="flex items-center">❌ {result || "Erro na análise da conversa"}</span>
        </div>
      )}

      {stage === "finished" && result && <div className="text-gray-800">{result}</div>}
    </div>
  )
}
