"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
  onGeolocation: () => void
}

export default function SearchBar({ onSearch, onGeolocation }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-grow">
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name (e.g., London, Tokyo, New York)"
          className="pl-10 pr-4 py-6 w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="py-6 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200"
        >
          Search
        </Button>

        <Button
          type="button"
          onClick={onGeolocation}
          variant="outline"
          className="py-6 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          title="Use my current location"
        >
          <MapPin size={20} />
        </Button>
      </div>
    </form>
  )
}
