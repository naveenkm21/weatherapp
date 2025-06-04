"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Map, Satellite, Mountain } from "lucide-react"

interface SimpleLeafletMapProps {
  city: string
  coordinates?: {
    lat: number
    lon: number
  }
}

type MapType = "street" | "satellite" | "terrain"

export default function SimpleLeafletMap({ city, coordinates }: SimpleLeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapType, setMapType] = useState<MapType>("street")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    if (!coordinates) {
      mapRef.current.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Search for a city to display the map</span>
          </div>
        </div>
      `
      return
    }

    setIsLoading(true)
    const { lat, lon } = coordinates

    // Get tile URL based on map type
    let tileUrl = ""
    let attribution = ""

    switch (mapType) {
      case "satellite":
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution = "© Esri"
        break
      case "terrain":
        tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution = "© OpenTopoMap"
        break
      default:
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution = "© OpenStreetMap"
    }

    // Create simple HTML map
    const mapHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          #map { height: 100vh; width: 100vw; }
          .leaflet-popup-content { text-align: center; font-family: system-ui; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          try {
            const map = L.map('map').setView([${lat}, ${lon}], 12);
            
            L.tileLayer('${tileUrl}', {
              attribution: '${attribution}',
              maxZoom: 18
            }).addTo(map);
            
            const marker = L.marker([${lat}, ${lon}]).addTo(map);
            marker.bindPopup('<b>${city}</b><br>Weather Location<br>${lat.toFixed(4)}, ${lon.toFixed(4)}');
            
            // Signal that map is loaded
            window.parent.postMessage('mapLoaded', '*');
          } catch (error) {
            console.error('Map error:', error);
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:red;">Map failed to load</div>';
          }
        </script>
      </body>
      </html>
    `

    // Create iframe
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    iframe.style.borderRadius = "0.5rem"
    iframe.srcdoc = mapHtml

    // Show loading state
    mapRef.current.innerHTML = `
      <div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <span>Loading map...</span>
        </div>
      </div>
    `

    // Listen for map loaded message
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "mapLoaded") {
        setIsLoading(false)
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
          mapRef.current.appendChild(iframe)
        }
        window.removeEventListener("message", handleMessage)
      }
    }

    window.addEventListener("message", handleMessage)

    // Fallback timeout
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
          mapRef.current.appendChild(iframe)
        }
        window.removeEventListener("message", handleMessage)
      }
    }, 5000)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [coordinates, mapType, city])

  const openInOpenStreetMap = () => {
    if (coordinates) {
      const { lat, lon } = coordinates
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`, "_blank")
    } else if (city) {
      window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(city)}`, "_blank")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location Map {city && `- ${city}`}
            </CardTitle>

            <Button
              variant="outline"
              size="sm"
              onClick={openInOpenStreetMap}
              className="text-xs"
              disabled={!city && !coordinates}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in OpenStreetMap
            </Button>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={mapType === "street" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMapType("street")}
              className="text-xs"
            >
              <Map className="w-3 h-3 mr-1" />
              Street
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
            <Button
              variant={mapType === "terrain" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMapType("terrain")}
              className="text-xs"
            >
              <Mountain className="w-3 h-3 mr-1" />
              Terrain
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[350px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner border"
        >
          {/* Map content is handled in useEffect */}
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Interactive map powered by Leaflet</span>
          {coordinates && (
            <span className="font-mono mt-1 sm:mt-0">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
