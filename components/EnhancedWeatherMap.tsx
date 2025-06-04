"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Satellite, Map, Navigation } from "lucide-react"

interface EnhancedWeatherMapProps {
  city: string
  coordinates?: {
    lat: number
    lon: number
  }
}

type MapType = "roadmap" | "satellite" | "hybrid" | "terrain"

export default function EnhancedWeatherMap({ city, coordinates }: EnhancedWeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapType, setMapType] = useState<MapType>("roadmap")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    // Clear previous content
    mapRef.current.innerHTML = ""

    if (!city && !coordinates) {
      const placeholder = document.createElement("div")
      placeholder.className = "flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400"
      placeholder.innerHTML = `
        <MapPin class="w-12 h-12 mb-2 opacity-50" />
        <span>Search for a city to display the map</span>
      `
      mapRef.current.appendChild(placeholder)
      return
    }

    // Create iframe with Google Maps
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    iframe.style.borderRadius = "0.5rem"
    iframe.loading = "lazy"
    iframe.allowFullscreen = true
    iframe.referrerPolicy = "no-referrer-when-downgrade"

    let mapUrl = ""

    if (coordinates) {
      // Use coordinates for more accurate positioning
      const { lat, lon } = coordinates
      mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TK7VCg&center=${lat},${lon}&zoom=12&maptype=${mapType}`
    } else {
      // Fallback to place search
      const encodedCity = encodeURIComponent(city)
      mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TK7VCg&q=${encodedCity}&zoom=12&maptype=${mapType}`
    }

    iframe.src = mapUrl

    // Add loading state
    const loadingDiv = document.createElement("div")
    loadingDiv.className = "flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
    loadingDiv.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
        <span>Loading Google Maps...</span>
      </div>
    `
    mapRef.current.appendChild(loadingDiv)

    // Replace loading with iframe when loaded
    iframe.onload = () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
        mapRef.current.appendChild(iframe)
      }
    }

    // Handle iframe load error
    iframe.onerror = () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
        const errorDiv = document.createElement("div")
        errorDiv.className = "flex flex-col items-center justify-center h-full text-red-500"
        errorDiv.innerHTML = `
          <div class="text-center">
            <p class="mb-2">Failed to load Google Maps</p>
            <p class="text-sm text-gray-500">Please check your internet connection</p>
          </div>
        `
        mapRef.current.appendChild(errorDiv)
      }
    }

    // Start loading the iframe
    iframe.style.display = "none"
    mapRef.current.appendChild(iframe)
  }, [city, coordinates, mapType])

  const handleMapTypeChange = (newMapType: MapType) => {
    setMapType(newMapType)
  }

  const openInGoogleMaps = () => {
    if (coordinates) {
      const { lat, lon } = coordinates
      window.open(`https://www.google.com/maps/@${lat},${lon},12z`, "_blank")
    } else if (city) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(city)}`, "_blank")
    }
  }

  return (
    <Card className={isFullscreen ? "fixed inset-4 z-50 bg-white dark:bg-gray-900" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location Map {city && `- ${city}`}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Powered by</span>
              <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="ml-1 font-medium text-blue-600">Google Maps</span>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={mapType === "roadmap" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMapTypeChange("roadmap")}
              className="text-xs"
            >
              <Map className="w-3 h-3 mr-1" />
              Road
            </Button>
            <Button
              variant={mapType === "satellite" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMapTypeChange("satellite")}
              className="text-xs"
            >
              <Satellite className="w-3 h-3 mr-1" />
              Satellite
            </Button>
            <Button
              variant={mapType === "hybrid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMapTypeChange("hybrid")}
              className="text-xs"
            >
              Hybrid
            </Button>
            <Button
              variant={mapType === "terrain" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMapTypeChange("terrain")}
              className="text-xs"
            >
              Terrain
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={openInGoogleMaps} className="text-xs">
            <Navigation className="w-3 h-3 mr-1" />
            Open in Google Maps
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={mapRef}
          className={`w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner ${
            isFullscreen ? "h-[calc(100vh-200px)]" : "h-[300px]"
          }`}
        >
          {/* Placeholder content is handled in useEffect */}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Interactive map showing the exact location of your weather data</span>
          {coordinates && (
            <span className="font-mono">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
