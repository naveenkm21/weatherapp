"use client"

import { Button } from "@/components/ui/button"
import { History, X } from "lucide-react"

interface SearchHistoryProps {
  history: string[]
  onSelect: (city: string) => void
  onClear: () => void
}

export default function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="mt-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <History size={16} className="mr-1" />
          <span>Recent searches</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X size={14} className="mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((city) => (
          <Button
            key={city}
            variant="outline"
            size="sm"
            onClick={() => onSelect(city)}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm rounded-full"
          >
            {city}
          </Button>
        ))}
      </div>
    </div>
  )
}
