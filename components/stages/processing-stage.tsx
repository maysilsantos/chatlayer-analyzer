"use client"

export default function ProcessingStage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <h2 className="text-2xl font-bold">Processando...</h2>
      <p className="text-center">Estamos processando sua solicitação. Por favor, aguarde.</p>
    </div>
  )
}
