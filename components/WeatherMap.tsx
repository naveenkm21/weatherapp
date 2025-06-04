"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, MapIcon, Satellite } from "lucide-react"

interface WeatherMapProps {
  city: string
  coordinates?: {
    lat: number
    lon: number
  }
}

type MapType = "roadmap" | "satellite"

export default function WeatherMap({ city, coordinates }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapType, setMapType] = useState<MapType>("roadmap")
  const [useGoogleMaps, setUseGoogleMaps] = useState<boolean>(false)

  // Check if Google Maps API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    setUseGoogleMaps(!!apiKey && apiKey.length > 10)
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear previous content
    mapRef.current.innerHTML = ""

    if (!city && !coordinates) {
      const placeholder = document.createElement("div")
      placeholder.className = "flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400"
      placeholder.innerHTML = `
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>Search for a city to display the map</span>
        </div>
      `
      mapRef.current.appendChild(placeholder)
      return
    }

    // Create iframe for map
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    iframe.style.borderRadius = "0.5rem"
    iframe.loading = "lazy"
    iframe.allowFullscreen = true
    iframe.referrerPolicy = "no-referrer-when-downgrade"

    let mapUrl = ""

    if (useGoogleMaps) {
      // Use Google Maps if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (coordinates) {
        // Use coordinates for more accurate positioning
        const { lat, lon } = coordinates
        mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lon}&zoom=12&maptype=${mapType}`
      } else {
        // Fallback to place search
        const encodedCity = encodeURIComponent(city)
        mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedCity}&zoom=12&maptype=${mapType}`
      }
    } else {
      // Fallback to OpenStreetMap if no Google Maps API key
      if (coordinates) {
        // Use coordinates for accurate positioning
        const { lat, lon } = coordinates
        const zoom = 12
        const bbox = `${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}`
        mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
      } else {
        // Fallback to city name search
        const encodedCity = encodeURIComponent(city)
        mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&query=${encodedCity}`
      }
    }

    iframe.src = mapUrl

    // Add loading state
    const loadingDiv = document.createElement("div")
    loadingDiv.className = "flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
    loadingDiv.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
        <span>Loading map...</span>
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
            <p class="mb-2">Failed to load map</p>
            <p class="text-sm text-gray-500">Please check your internet connection</p>
          </div>
        `
        mapRef.current.appendChild(errorDiv)
      }
    }

    // Start loading the iframe
    iframe.style.display = "none"
    mapRef.current.appendChild(iframe)
  }, [city, coordinates, mapType, useGoogleMaps])

  const openInGoogleMaps = () => {
    if (coordinates) {
      const { lat, lon } = coordinates
      window.open(`https://www.google.com/maps/@${lat},${lon},12z`, "_blank")
    } else if (city) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(city)}`, "_blank")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location Map {city && `- ${city}`}
          </CardTitle>

          <div className="flex items-center gap-2">
            {useGoogleMaps && (
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={mapType === "roadmap" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("roadmap")}
                  className="text-xs"
                >
                  <MapIcon className="w-3 h-3 mr-1" />
                  Map
                </Button>
                <Button
                  variant={mapType === "satellite" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("satellite")}
                  className="text-xs"
                >
                  <Satellite className="w-3 h-3 mr-1" />
                  Satellite
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={openInGoogleMaps}
              className="text-xs"
              disabled={!city && !coordinates}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in Google Maps
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner"
        >
          {/* Placeholder content is handled in useEffect */}
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Interactive map showing the exact location of your weather data</span>
          {coordinates && (
            <span className="font-mono mt-1 sm:mt-0">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </span>
          )}
        </div>

        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400">
            {useGoogleMaps ? "Map data © Google" : "Map data © OpenStreetMap contributors"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
