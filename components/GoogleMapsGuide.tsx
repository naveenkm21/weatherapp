"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, Info, Shield, CreditCard } from "lucide-react"

export default function GoogleMapsGuide() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center text-2xl">
          <Key className="mr-2 h-6 w-6" />
          Google Maps API Key Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Follow these steps to create a Google Maps API key for your weather application.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                1
              </span>
              Create a Google Cloud Project
            </h3>
            <ol className="list-decimal ml-8 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Go to the{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline inline-flex items-center"
                >
                  Google Cloud Console
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click on the project dropdown at the top of the page</li>
              <li>Click "New Project"</li>
              <li>Enter a name for your project (e.g., "Weather App")</li>
              <li>Click "Create"</li>
              <li>Wait for the project to be created and select it</li>
            </ol>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                2
              </span>
              Enable Required APIs
            </h3>
            <ol className="list-decimal ml-8 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <li>In your project, navigate to "APIs &amp; Services" &gt; "Library"</li>
              <li>
                Search for and enable these APIs (click each one and press "Enable"):
                <ul className="list-disc ml-6 mt-1">
                  <li>Maps JavaScript API</li>
                  <li>Maps Embed API</li>
                  <li>Geocoding API</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                3
              </span>
              Create API Key
            </h3>
            <ol className="list-decimal ml-8 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Navigate to "APIs &amp; Services" &gt; "Credentials"</li>
              <li>Click "Create Credentials" at the top of the page</li>
              <li>Select "API key" from the dropdown menu</li>
              <li>Your new API key will be displayed in a popup</li>
              <li>Copy this key and keep it secure</li>
            </ol>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                4
              </span>
              Restrict Your API Key (Recommended)
            </h3>
            <ol className="list-decimal ml-8 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <li>In the credentials page, click on your newly created API key</li>
              <li>Under "Application restrictions", select "HTTP referrers (websites)"</li>
              <li>
                Add your website domains (e.g., <code>*.yourdomain.com/*</code>)
              </li>
              <li>
                For development, you can add <code>localhost/*</code> and <code>127.0.0.1/*</code>
              </li>
              <li>Under "API restrictions", select "Restrict key"</li>
              <li>Select the APIs you enabled earlier</li>
              <li>Click "Save"</li>
            </ol>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                5
              </span>
              Set Up Billing (Required for Production)
            </h3>
            <div className="ml-8 mt-2 text-gray-700 dark:text-gray-300">
              <p>
                Google Maps Platform requires a billing account, but offers a $200 monthly credit (enough for most small
                to medium projects):
              </p>
              <ol className="list-decimal ml-6 mt-2 space-y-2">
                <li>In the Google Cloud Console, go to "Billing"</li>
                <li>Click "Link a billing account"</li>
                <li>Follow the steps to set up billing</li>
                <li>You can set up budget alerts to monitor usage at "Billing" &gt; "Budgets &amp; alerts"</li>
              </ol>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <h3 className="font-semibold text-lg flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                6
              </span>
              Add API Key to Your Weather App
            </h3>
            <ol className="list-decimal ml-8 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Create an environment variable named <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
              </li>
              <li>Set its value to your newly created API key</li>
              <li>
                For local development, add it to your <code>.env.local</code> file:
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono mt-1">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                </div>
              </li>
              <li>For production, add it to your hosting environment variables (e.g., Vercel, Netlify)</li>
            </ol>
          </div>
        </div>

        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CreditCard className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            <strong>Billing Note:</strong> Google Maps Platform offers $200 in free monthly usage, which is typically
            sufficient for small to medium-sized applications. Monitor your usage to avoid unexpected charges.
          </AlertDescription>
        </Alert>

        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            <strong>Security Tip:</strong> Never commit your API key to public repositories. Always use environment
            variables and add <code>.env.local</code> to your <code>.gitignore</code> file.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
