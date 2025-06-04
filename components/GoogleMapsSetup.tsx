"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, MapPin } from "lucide-react"

export default function GoogleMapsSetup() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" />
          Google Maps API Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            To use Google Maps, you need to set up a Google Maps API key. Follow these steps:
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Step 1: Get Google Maps API Key</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Go to the{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center"
              >
                Google Cloud Console
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Step 2: Enable APIs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable "Maps Embed API" and "Maps JavaScript API"
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Step 3: Create API Key</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new API key and restrict it to your domain
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Step 4: Add to Environment</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">Step 5: Update Component</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Replace the placeholder API key in WeatherMap.tsx with:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono">
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> Google Maps API has usage limits. The first $200 of usage per month is free, which
            covers most personal projects.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
