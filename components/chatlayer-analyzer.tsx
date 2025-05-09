"use client"

import { useAppState } from "@/context/app-state-context"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Bot, MessageSquare, Infinity, RefreshCw, Clock, AlertTriangle } from "lucide-react"
import ConversationPreview from "@/components/conversation-preview"
import AnalysisResult from "@/components/analysis-result"
import UserToneSelector from "@/components/user-tone-selector"
import { useState, useEffect } from "react"

export default function ChatlayerAnalyzer() {
  const { state, updateState, startAnalysis, resetAnalysis, fetchConversationUpdates, submitAnalysisResult } =
    useAppState()
  const [expirationInfo, setExpirationInfo] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleStartAnalysis = async () => {
    // Limpar explicitamente o histórico de conversas antes de iniciar
    if (state.stage === "finished" || state.stage === "error") {
      resetAnalysis()
      await new Promise((resolve) => setTimeout(resolve, 500)) // Pequeno delay para efeito visual
    } else {
      // Mesmo se não estiver no estágio "finished", limpar o histórico
      updateState({ conversation: [] })
    }

    startAnalysis()
  }

  // Função para simular o envio de um resultado de análise
  const handleSimulateAnalysisResult = async () => {
    try {
      console.log(`Simulando resultado para conversationId: ${state.conversationId}`)

      const response = await fetch("/api/get-analysis-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          conversationId: state.conversationId,
          result: `
## Análise Simulada da Conversa (ID: ${state.conversationId})

### Pontos Fortes:
- Resposta rápida às solicitações do usuário
- Opções claras de agendamento
- Confirmação visual com mapa

### Áreas para Melhoria:
- Poderia oferecer mais detalhes sobre os serviços
- Faltou perguntar sobre o tipo de bicicleta
- Não ofereceu opções de cancelamento

### Recomendações:
1. Adicionar mais detalhes sobre os serviços disponíveis
2. Perguntar sobre o tipo/modelo da bicicleta
3. Oferecer política de cancelamento
          `,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar resultado da análise")
      }

      const data = await response.json()
      submitAnalysisResult(data.result)
    } catch (error) {
      console.error("Erro ao simular resultado da análise:", error)
    }
  }

  // Função para obter informações sobre a expiração
  const fetchExpirationInfo = async () => {
    try {
      const response = await fetch("/api/conversation-updates", {
        method: "OPTIONS",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json()
          setExpirationInfo(`Conversas expiram após ${data.expirationTimeHours} horas de inatividade`)
        }
      }
    } catch (error) {
      console.error("Erro ao buscar informações de expiração:", error)
    }
  }

  // Função para atualizar manualmente as conversas
  const handleRefreshConversation = async () => {
    setIsRefreshing(true)
    try {
      await fetchConversationUpdates()
    } catch (error) {
      console.error("Erro ao atualizar conversas:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Buscar informações de expiração ao carregar o componente
  useEffect(() => {
    fetchExpirationInfo()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">QA Test Bot</h1>
        <p className="text-sm text-muted-foreground">Conversation ID: {state.conversationId}</p>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
        </p>
        {expirationInfo && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
            <Clock className="h-3 w-3 mr-1" />
            {expirationInfo}
          </p>
        )}
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

          {/* Seletor de tom do usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Tone</CardTitle>
            </CardHeader>
            <CardContent>
              <UserToneSelector />
            </CardContent>
          </Card>

          {/* Campo para Goal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversation Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  value={state.goal}
                  onChange={(e) => updateState({ goal: e.target.value })}
                  placeholder="Enter the goal of this test scenario"
                />
              </div>
            </CardContent>
          </Card>

          {/* Campo para Intents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bot Intents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="intents">Intents (comma separated)</Label>
                <Textarea
                  id="intents"
                  value={state.intents}
                  onChange={(e) => updateState({ intents: e.target.value })}
                  placeholder="Enter intents separated by commas (e.g., book_checkup, show_all_models, track_order)"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botão de análise e indicador de status */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <Button onClick={handleStartAnalysis} size="lg" className="bg-teal-600 hover:bg-teal-700">
                Start bot analysis
              </Button>

              {state.stage === "processing" && (
                <Button onClick={handleSimulateAnalysisResult} variant="outline" size="lg">
                  Simular Resultado
                </Button>
              )}
            </div>

            <div className="h-10 flex items-center justify-center">
              {state.stage === "processing" && state.isLoading && (
                <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
              )}
              {state.stage === "finished" && (
                <div className="bg-green-500 rounded-full p-1">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
              {state.stage === "error" && (
                <div className="bg-red-500 rounded-full p-1">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna da direita - Preview e Análise */}
        <div className="space-y-6">
          {/* Preview da conversa */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Conversation Interaction Preview</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshConversation}
                className="h-8 px-2"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
              <ConversationPreview conversation={state.conversation} />
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {state.conversation.length} messages • Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
            </CardFooter>
          </Card>

          {/* Resultado da análise */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Conversation Analysis and improvement suggestions</CardTitle>
              {state.stage === "finished" && (
                <Button variant="outline" size="sm" onClick={resetAnalysis} className="h-8 px-2">
                  New Analysis
                </Button>
              )}
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
