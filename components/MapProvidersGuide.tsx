"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, DollarSign, Key, Globe } from "lucide-react"

export default function MapProvidersGuide() {
  const providers = [
    {
      name: "OpenStreetMap (OSM)",
      icon: <Globe className="h-5 w-5" />,
      cost: "Free",
      apiKey: "Not Required",
      features: {
        embedding: true,
        satellite: false,
        traffic: false,
        streetView: false,
        customization: "Limited",
      },
      pros: [
        "Completely free to use",
        "No API key required",
        "Open source and community-driven",
        "Good global coverage",
        "No usage limits",
      ],
      cons: ["Limited satellite imagery", "Basic styling options", "No traffic data"],
      setup: "Ready to use - no setup required",
      bestFor: "Simple location display, budget-conscious projects",
    },
    {
      name: "Mapbox",
      icon: <div className="h-5 w-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">M</div>,
      cost: "Free tier: 50,000 loads/month",
      apiKey: "Required",
      features: {
        embedding: true,
        satellite: true,
        traffic: true,
        streetView: false,
        customization: "Excellent",
      },
      pros: [
        "Beautiful, customizable maps",
        "Excellent satellite imagery",
        "Good free tier",
        "Great developer tools",
        "Fast performance",
      ],
      cons: ["Requires API key", "Can be expensive at scale", "Learning curve for customization"],
      setup: "Sign up at mapbox.com, get API key",
      bestFor: "Custom styled maps, modern applications",
    },
    {
      name: "Bing Maps",
      icon: <div className="h-5 w-5 bg-green-600 rounded text-white text-xs flex items-center justify-center">B</div>,
      cost: "Free tier: 125,000 transactions/year",
      apiKey: "Optional for basic embedding",
      features: {
        embedding: true,
        satellite: true,
        traffic: true,
        streetView: true,
        customization: "Good",
      },
      pros: [
        "Good free tier",
        "Satellite imagery included",
        "Traffic data available",
        "Street view support",
        "Microsoft ecosystem integration",
      ],
      cons: ["Less popular than Google Maps", "Limited customization", "Requires Microsoft account"],
      setup: "Create Bing Maps account, optional API key",
      bestFor: "Microsoft ecosystem, satellite imagery needs",
    },
    {
      name: "HERE Maps",
      icon: <div className="h-5 w-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center">H</div>,
      cost: "Free tier: 250,000 requests/month",
      apiKey: "Required",
      features: {
        embedding: true,
        satellite: true,
        traffic: true,
        streetView: false,
        customization: "Good",
      },
      pros: [
        "Generous free tier",
        "Excellent for automotive/navigation",
        "Good global coverage",
        "Real-time traffic data",
        "Offline capabilities",
      ],
      cons: ["Requires API key", "Less familiar to users", "Complex pricing structure"],
      setup: "Sign up at developer.here.com, get API key",
      bestFor: "Navigation apps, automotive applications",
    },
    {
      name: "Leaflet + Tile Providers",
      icon: <div className="h-5 w-5 bg-green-500 rounded text-white text-xs flex items-center justify-center">L</div>,
      cost: "Free (depends on tile provider)",
      apiKey: "Not Required",
      features: {
        embedding: true,
        satellite: true,
        traffic: false,
        streetView: false,
        customization: "Excellent",
      },
      pros: [
        "Open source and flexible",
        "Many free tile providers",
        "Highly customizable",
        "Lightweight",
        "Great for developers",
      ],
      cons: ["Requires more setup", "Need to choose tile providers", "No built-in traffic data"],
      setup: "Include Leaflet library, choose tile providers",
      bestFor: "Developer-friendly projects, custom implementations",
    },
  ]

  const getFeatureIcon = (feature: boolean | string) => {
    if (typeof feature === "boolean") {
      return feature ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Map Provider Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Choose the best map provider for your weather application based on your needs and budget.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {providers.map((provider, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {provider.icon}
                  <CardTitle className="text-xl">{provider.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {provider.cost}
                  </Badge>
                  <Badge variant={provider.apiKey === "Required" ? "destructive" : "secondary"}>
                    <Key className="h-3 w-3 mr-1" />
                    {provider.apiKey}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">Pros</h4>
                  <ul className="space-y-1">
                    {provider.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">Cons</h4>
                  <ul className="space-y-1">
                    {provider.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Embedding</span>
                      {getFeatureIcon(provider.features.embedding)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satellite View</span>
                      {getFeatureIcon(provider.features.satellite)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traffic Data</span>
                      {getFeatureIcon(provider.features.traffic)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Street View</span>
                      {getFeatureIcon(provider.features.streetView)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customization</span>
                      <span className="text-sm font-medium">{provider.features.customization}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Setup & Best For</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Setup:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{provider.setup}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Best For:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{provider.bestFor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
