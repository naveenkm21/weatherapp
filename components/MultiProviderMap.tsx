"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Globe, Satellite, Map, Navigation } from "lucide-react"

interface MultiProviderMapProps {
  city: string
  coordinates?: {
    lat: number
    lon: number
  }
}

type MapProvider = "openstreetmap" | "mapbox" | "bing" | "here" | "leaflet"
type MapType = "roadmap" | "satellite" | "terrain"

export default function MultiProviderMap({ city, coordinates }: MultiProviderMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapProvider, setMapProvider] = useState<MapProvider>("openstreetmap")
  const [mapType, setMapType] = useState<MapType>("roadmap")

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

    if (coordinates) {
      const { lat, lon } = coordinates

      switch (mapProvider) {
        case "openstreetmap":
          const zoom = 12
          const bbox = `${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}`
          mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
          break

        case "mapbox":
          // Using Mapbox static API (requires API key for full features, but this works for basic display)
          mapUrl = `https://api.mapbox.com/styles/v1/mapbox/${
            mapType === "satellite" ? "satellite-v9" : "streets-v11"
          }/static/pin-s-l+000(${lon},${lat})/${lon},${lat},12/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
          break

        case "bing":
          // Bing Maps embed (free tier available)
          mapUrl = `https://www.bing.com/maps/embed?h=400&w=600&cp=${lat}~${lon}&lvl=12&typ=${
            mapType === "satellite" ? "a" : "r"
          }&sty=r&src=SHELL&FORM=MBEDV8`
          break

        case "here":
          // HERE Maps embed
          mapUrl = `https://wego.here.com/directions/mix/${lat},${lon}:${city}?map=${lat},${lon},12,${
            mapType === "satellite" ? "satellite" : "normal"
          }&fb_locale=en_US`
          break

        case "leaflet":
          // Custom Leaflet implementation with different tile providers
          createLeafletMap(lat, lon)
          return

        default:
          mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
      }
    } else {
      // Fallback to city search for providers that support it
      const encodedCity = encodeURIComponent(city)

      switch (mapProvider) {
        case "openstreetmap":
          mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&query=${encodedCity}`
          break
        case "bing":
          mapUrl = `https://www.bing.com/maps/embed?h=400&w=600&q=${encodedCity}&lvl=12&typ=r&sty=r&src=SHELL&FORM=MBEDV8`
          break
        default:
          mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik&query=${encodedCity}`
      }
    }

    if (mapProvider === "mapbox" && coordinates) {
      // For Mapbox, create an img element instead of iframe
      const img = document.createElement("img")
      img.src = mapUrl
      img.style.width = "100%"
      img.style.height = "100%"
      img.style.objectFit = "cover"
      img.style.borderRadius = "0.5rem"
      img.alt = `Map of ${city}`

      img.onload = () => {
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
          mapRef.current.appendChild(img)
        }
      }

      img.onerror = () => {
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
          const errorDiv = document.createElement("div")
          errorDiv.className = "flex flex-col items-center justify-center h-full text-red-500"
          errorDiv.innerHTML = `
            <div class="text-center">
              <p class="mb-2">Failed to load Mapbox map</p>
              <p class="text-sm text-gray-500">Switching to OpenStreetMap...</p>
            </div>
          `
          mapRef.current.appendChild(errorDiv)
          setTimeout(() => setMapProvider("openstreetmap"), 2000)
        }
      }

      // Add loading state
      const loadingDiv = document.createElement("div")
      loadingDiv.className = "flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
      loadingDiv.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <span>Loading Mapbox map...</span>
        </div>
      `
      mapRef.current.appendChild(loadingDiv)

      mapRef.current.appendChild(img)
      return
    }

    iframe.src = mapUrl

    // Add loading state
    const loadingDiv = document.createElement("div")
    loadingDiv.className = "flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
    loadingDiv.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
        <span>Loading ${mapProvider} map...</span>
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
            <p class="mb-2">Failed to load ${mapProvider} map</p>
            <p class="text-sm text-gray-500">Switching to OpenStreetMap...</p>
          </div>
        `
        mapRef.current.appendChild(errorDiv)
        setTimeout(() => setMapProvider("openstreetmap"), 2000)
      }
    }

    // Start loading the iframe
    iframe.style.display = "none"
    mapRef.current.appendChild(iframe)
  }, [city, coordinates, mapProvider, mapType])

  const createLeafletMap = (lat: number, lon: number) => {
    if (!mapRef.current) return

    // Create a custom Leaflet map with different tile providers
    const mapContainer = document.createElement("div")
    mapContainer.style.width = "100%"
    mapContainer.style.height = "100%"
    mapContainer.style.borderRadius = "0.5rem"
    mapContainer.style.overflow = "hidden"

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

    // Create a simple tile-based map display
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    iframe.style.borderRadius = "0.5rem"
    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${lat}, ${lon}], 12);
          L.tileLayer('${tileUrl}', {
            attribution: '${attribution}',
            maxZoom: 18
          }).addTo(map);
          L.marker([${lat}, ${lon}]).addTo(map)
            .bindPopup('${city}')
            .openPopup();
        </script>
      </body>
      </html>
    `

    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(iframe)
  }

  const openInExternalMap = () => {
    if (coordinates) {
      const { lat, lon } = coordinates
      let url = ""

      switch (mapProvider) {
        case "openstreetmap":
          url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`
          break
        case "bing":
          url = `https://www.bing.com/maps?cp=${lat}~${lon}&lvl=12`
          break
        case "here":
          url = `https://wego.here.com/directions/mix/${lat},${lon}:${city}`
          break
        default:
          url = `https://www.google.com/maps/@${lat},${lon},12z`
      }

      window.open(url, "_blank")
    } else if (city) {
      const encodedCity = encodeURIComponent(city)
      window.open(`https://www.google.com/maps/search/${encodedCity}`, "_blank")
    }
  }

  const getProviderName = (provider: MapProvider) => {
    switch (provider) {
      case "openstreetmap":
        return "OpenStreetMap"
      case "mapbox":
        return "Mapbox"
      case "bing":
        return "Bing Maps"
      case "here":
        return "HERE Maps"
      case "leaflet":
        return "Leaflet"
      default:
        return "Map"
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
              onClick={openInExternalMap}
              className="text-xs"
              disabled={!city && !coordinates}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in {getProviderName(mapProvider)}
            </Button>
          </div>

          {/* Map Provider Selection */}
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={mapProvider === "openstreetmap" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapProvider("openstreetmap")}
                className="text-xs"
              >
                <Globe className="w-3 h-3 mr-1" />
                OSM
              </Button>
              <Button
                variant={mapProvider === "mapbox" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapProvider("mapbox")}
                className="text-xs"
              >
                Mapbox
              </Button>
              <Button
                variant={mapProvider === "bing" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapProvider("bing")}
                className="text-xs"
              >
                Bing
              </Button>
              <Button
                variant={mapProvider === "leaflet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapProvider("leaflet")}
                className="text-xs"
              >
                Leaflet
              </Button>
            </div>

            {/* Map Type Selection */}
            {(mapProvider === "bing" || mapProvider === "mapbox" || mapProvider === "leaflet") && (
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={mapType === "roadmap" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("roadmap")}
                  className="text-xs"
                >
                  <Map className="w-3 h-3 mr-1" />
                  Road
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
                {mapProvider === "leaflet" && (
                  <Button
                    variant={mapType === "terrain" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setMapType("terrain")}
                    className="text-xs"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Terrain
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner"
        >
          {/* Map content is handled in useEffect */}
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
            Map data © {getProviderName(mapProvider)}
            {mapProvider === "openstreetmap" && " contributors"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
