"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Map, Satellite, Mountain, Layers } from "lucide-react"

interface LeafletMapProps {
  city: string
  coordinates?: {
    lat: number
    lon: number
  }
}

type MapType = "street" | "satellite" | "terrain" | "topo"

export default function LeafletMap({ city, coordinates }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [mapType, setMapType] = useState<MapType>("street")
  const [isLoading, setIsLoading] = useState(false)
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null)

  // Memoize the tile configuration to prevent unnecessary re-renders
  const getTileConfig = useCallback((type: MapType) => {
    switch (type) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "© Esri, Maxar, Earthstar Geographics",
          maxZoom: 18,
        }
      case "terrain":
        return {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution: "© OpenTopoMap (CC-BY-SA)",
          maxZoom: 17,
        }
      case "topo":
        return {
          url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          attribution: "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team",
          maxZoom: 19,
        }
      default: // street
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }
    }
  }, [])

  // Only update map when coordinates actually change or map type changes
  useEffect(() => {
    if (!mapRef.current) return

    // Clear previous content only if no coordinates
    if (!coordinates) {
      mapRef.current.innerHTML = ""
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

    // Check if coordinates have actually changed
    const coordsChanged =
      !currentCoords || currentCoords.lat !== coordinates.lat || currentCoords.lon !== coordinates.lon

    // Only recreate map if coordinates changed or map type changed
    if (coordsChanged || !iframeRef.current) {
      setCurrentCoords(coordinates)
      createLeafletMap(coordinates.lat, coordinates.lon)
    } else if (iframeRef.current) {
      // Just update the map type without recreating the entire map
      updateMapType(coordinates.lat, coordinates.lon)
    }
  }, [coordinates, mapType, currentCoords, getTileConfig])

  const createLeafletMap = useCallback(
    (lat: number, lon: number) => {
      if (!mapRef.current) return

      setIsLoading(true)

      const tileConfig = getTileConfig(mapType)

      // Create iframe with Leaflet map
      const iframe = document.createElement("iframe")
      iframe.style.width = "100%"
      iframe.style.height = "100%"
      iframe.style.border = "none"
      iframe.style.borderRadius = "0.5rem"
      iframe.loading = "lazy"

      // Create the HTML content for the iframe
      const mapHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
              integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
              crossorigin=""/>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
          }
          #map { 
            height: 100vh; 
            width: 100vw; 
          }
          .weather-popup {
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
          }
          .weather-popup h3 {
            margin: 0 0 8px 0;
            color: #2563eb;
            font-size: 16px;
          }
          .weather-popup p {
            margin: 4px 0;
            color: #374151;
          }
          .custom-marker {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative;
          }
          .custom-marker::after {
            content: '📍';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
                crossorigin=""></script>
        <script>
          let map, marker, tileLayer;
          
          function initMap() {
            // Initialize the map
            map = L.map('map', {
              center: [${lat}, ${lon}],
              zoom: 12,
              zoomControl: true,
              scrollWheelZoom: true,
              doubleClickZoom: true,
              boxZoom: true,
              keyboard: true,
              dragging: true,
              touchZoom: true,
              fadeAnimation: false,
              zoomAnimation: false,
              markerZoomAnimation: false
            });

            // Add tile layer
            tileLayer = L.tileLayer('${tileConfig.url}', {
              attribution: '${tileConfig.attribution}',
              maxZoom: ${tileConfig.maxZoom},
              subdomains: ['a', 'b', 'c']
            }).addTo(map);

            // Create custom weather marker icon
            var weatherIcon = L.divIcon({
              className: 'custom-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30]
            });

            // Add marker with weather information
            marker = L.marker([${lat}, ${lon}], { icon: weatherIcon }).addTo(map);
            
            // Create popup content
            var popupContent = \`
              <div class="weather-popup">
                <h3>📍 ${city}</h3>
                <p><strong>Coordinates:</strong><br>${lat.toFixed(4)}, ${lon.toFixed(4)}</p>
                <p><strong>Weather Location</strong><br>Current weather data point</p>
              </div>
            \`;
            
            marker.bindPopup(popupContent);

            // Add scale control
            L.control.scale({
              position: 'bottomleft',
              metric: true,
              imperial: false
            }).addTo(map);

            // Add attribution control
            map.attributionControl.setPrefix('Powered by <a href="https://leafletjs.com/">Leaflet</a>');
          }

          // Initialize map when page loads
          document.addEventListener('DOMContentLoaded', initMap);
          
          // Fallback initialization
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMap);
          } else {
            initMap();
          }
        </script>
      </body>
      </html>
    `

      iframe.srcdoc = mapHtml

      // Clear and add loading state
      mapRef.current.innerHTML = ""

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
        setIsLoading(false)
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
          mapRef.current.appendChild(iframe)
          iframeRef.current = iframe
        }
      }

      // Handle iframe load error
      iframe.onerror = () => {
        setIsLoading(false)
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
    },
    [mapType, city, getTileConfig],
  )

  const updateMapType = useCallback(
    (lat: number, lon: number) => {
      // For map type changes, we need to recreate the map
      // This is more efficient than trying to update the tile layer
      createLeafletMap(lat, lon)
    },
    [createLeafletMap],
  )

  const openInOpenStreetMap = useCallback(() => {
    if (coordinates) {
      const { lat, lon } = coordinates
      // Open in OpenStreetMap with marker and zoom level
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12#map=12/${lat}/${lon}`, "_blank")
    } else if (city) {
      // Search for city in OpenStreetMap
      const encodedCity = encodeURIComponent(city)
      window.open(`https://www.openstreetmap.org/search?query=${encodedCity}`, "_blank")
    }
  }, [coordinates, city])

  const getMapTypeInfo = useCallback((type: MapType) => {
    switch (type) {
      case "satellite":
        return { name: "Satellite", description: "High-resolution satellite imagery" }
      case "terrain":
        return { name: "Terrain", description: "Topographic map with elevation data" }
      case "topo":
        return { name: "Humanitarian", description: "Detailed humanitarian mapping" }
      default:
        return { name: "Street", description: "Standard street map view" }
    }
  }, [])

  const currentMapInfo = getMapTypeInfo(mapType)

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

          {/* Map Type Selection */}
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={mapType === "street" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapType("street")}
                className="text-xs"
                title="Standard street map"
              >
                <Map className="w-3 h-3 mr-1" />
                Street
              </Button>
              <Button
                variant={mapType === "satellite" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapType("satellite")}
                className="text-xs"
                title="Satellite imagery"
              >
                <Satellite className="w-3 h-3 mr-1" />
                Satellite
              </Button>
              <Button
                variant={mapType === "terrain" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapType("terrain")}
                className="text-xs"
                title="Topographic terrain map"
              >
                <Mountain className="w-3 h-3 mr-1" />
                Terrain
              </Button>
              <Button
                variant={mapType === "topo" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapType("topo")}
                className="text-xs"
                title="Humanitarian mapping"
              >
                <Layers className="w-3 h-3 mr-1" />
                Topo
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <span className="font-medium">{currentMapInfo.name}:</span>
              <span className="ml-1">{currentMapInfo.description}</span>
            </div>
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
          <span>Interactive map powered by Leaflet with OpenStreetMap data</span>
          {coordinates && (
            <span className="font-mono mt-1 sm:mt-0">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </span>
          )}
        </div>

        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400">Map data © OpenStreetMap contributors • Powered by Leaflet</span>
        </div>
      </CardContent>
    </Card>
  )
}
