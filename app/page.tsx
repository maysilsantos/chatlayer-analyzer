"use client"
import { AppStateProvider } from "@/context/app-state-context"
import ChatlayerAnalyzer from "@/components/chatlayer-analyzer"

export default function Home() {
  return (
    <AppStateProvider>
      <main className="min-h-screen bg-gray-50">
        <ChatlayerAnalyzer />
      </main>
    </AppStateProvider>
  )
}
