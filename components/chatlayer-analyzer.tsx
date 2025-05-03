"use client"

import { useAppState } from "@/context/app-state-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Bot, MessageSquare, Infinity } from "lucide-react"
import ConversationPreview from "@/components/conversation-preview"
import AnalysisResult from "@/components/analysis-result"

export default function ChatlayerAnalyzer() {
  const { state, updateState, startAnalysis, resetAnalysis } = useAppState()

  const handleStartAnalysis = async () => {
    if (state.stage === "finished") {
      resetAnalysis()
      await new Promise((resolve) => setTimeout(resolve, 500)) // Pequeno delay para efeito visual
    }
    startAnalysis()
  }

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">QA Test Bot</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna da esquerda - Formulário */}
        <div className="space-y-6">
          {/* Logos */}
          <div className="flex items-center space-x-6 mb-4">
            <Infinity className="h-10 w-10 text-black" />
            <Bot className="h-10 w-10 text-teal-500 bg-teal-100 p-1 rounded-full" />
            <MessageSquare className="h-10 w-10 text-yellow-500" />
          </div>

          {/* Credenciais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Insert Chatlayer Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botId">botId</Label>
                <Input
                  id="botId"
                  value={state.botId}
                  onChange={(e) => updateState({ botId: e.target.value })}
                  placeholder="Enter bot ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Bearer token</Label>
                <Input
                  id="token"
                  type="password"
                  value={state.token}
                  onChange={(e) => updateState({ token: e.target.value })}
                  placeholder="Enter bearer token"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint">endpoint</Label>
                <Input
                  id="endpoint"
                  value={state.endpoint}
                  onChange={(e) => updateState({ endpoint: e.target.value })}
                  placeholder="Enter endpoint URL"
                />
              </div>
            </CardContent>
          </Card>

          {/* Descrição do comportamento humano */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description of human profile and how he will behave</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={state.humanDescription}
                onChange={(e) => updateState({ humanDescription: e.target.value })}
                placeholder="Should be used to: insert description of how users will behave during the conversation (if user is going to be a detractor, will try his best to do some action, if user is old or young...etc)"
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Descrição do chatbot */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description of what chatbot does and their flows</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={state.botDescription}
                onChange={(e) => updateState({ botDescription: e.target.value })}
                placeholder="Should be used to: Description of what the chatbot does, their flows, how they connect..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Botão de análise e indicador de status */}
          <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleStartAnalysis} size="lg" className="bg-teal-600 hover:bg-teal-700">
              Start bot analysis
            </Button>

            <div className="h-10 flex items-center justify-center">
              {state.stage === "processing" && state.isLoading && (
                <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              )}
              {state.stage === "finished" && (
                <div className="bg-green-500 rounded-full p-1">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna da direita - Preview e Análise */}
        <div className="space-y-6">
          {/* Preview da conversa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversation Interaction Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationPreview conversation={state.conversation} />
            </CardContent>
          </Card>

          {/* Resultado da análise */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversation Analysis and improvement suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalysisResult stage={state.stage} result={state.analysisResult} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
