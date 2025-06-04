"use client"

import { Button } from "@/components/ui/button"
import type { TemperatureUnit } from "@/types/weather"

interface UnitToggleProps {
  unit: TemperatureUnit
  onUnitChange: (unit: TemperatureUnit) => void
}

export default function UnitToggle({ unit, onUnitChange }: UnitToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
      <Button
        variant={unit === "metric" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-4 ${
          unit === "metric"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => onUnitChange("metric")}
      >
        °C
      </Button>

      <Button
        variant={unit === "imperial" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-4 ${
          unit === "imperial"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => onUnitChange("imperial")}
      >
        °F
      </Button>
    </div>
  )
}
