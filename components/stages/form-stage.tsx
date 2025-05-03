"use client"

import type React from "react"

import { useState } from "react"
import { useAppState } from "@/context/app-state-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitFormData } from "@/lib/api-client"

export default function FormStage() {
  const { updateStage, updateData } = useAppState()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      updateStage("processing")
      updateData({ name, email })

      // Simula uma chamada de API
      const result = await submitFormData({ name, email })

      // Atualiza o estado com o resultado
      updateData({ result })
      updateStage("result")
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      updateData({ error: "Ocorreu um erro ao processar sua solicitação." })
      updateStage("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Preencha o Formulário</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Digite seu nome"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu email"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => updateStage("initial")}>
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  )
}
