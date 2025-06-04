import { Card, CardContent } from "@/components/ui/card"

export default function LoadingState() {
  return (
    <Card className="mt-8 overflow-hidden border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="weather-loader"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading weather data...</p>
        </div>
      </CardContent>
    </Card>
  )
}
