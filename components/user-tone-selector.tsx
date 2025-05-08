"use client"

import { useAppState } from "@/context/app-state-context"
import type { UserTone } from "@/context/app-state-context"
import { cn } from "@/lib/utils"

interface UserToneSelectorProps {
  className?: string
}

export default function UserToneSelector({ className }: UserToneSelectorProps) {
  const { state, toggleUserTone } = useAppState()

  // Lista de todos os tons disponíveis
  const availableTones: UserTone[] = ["polite", "impatient", "stressed", "enthusiastic", "frustrated", "confused"]

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">User tone</h3>
        <span className="text-xs text-muted-foreground">Select 4 maximum</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTones.map((tone) => (
          <button
            key={tone}
            onClick={() => toggleUserTone(tone)}
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-colors",
              state.userTones.includes(tone)
                ? "bg-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
            type="button"
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  )
}
