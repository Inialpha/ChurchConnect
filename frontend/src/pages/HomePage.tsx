import { Link } from "react-router-dom";
import { Search, Church, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ChurchConnect</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/churches" className="text-gray-700 hover:text-blue-600 font-medium">
                Churches
              </Link>
              <Link to="/ministers" className="text-gray-700 hover:text-blue-600 font-medium">
                Ministers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Find Your Spiritual
            <span className="text-blue-600 block">Community</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with churches and ministers in your area. Discover communities of faith and spiritual leaders near
            you.
          </p>
        </div>

        {/* Quick Search Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Church className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Find Churches</CardTitle>
              <CardDescription>Search for churches by name, location, or community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input placeholder="Search by church name..." />
                <Input placeholder="State" />
                <Input placeholder="Local Government Area" />
              </div>
              <Link href="/churches" className="block">
                <Button className="w-full" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Search Churches
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Find Ministers</CardTitle>
              <CardDescription>Search for ministers by name, email, or church affiliation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input placeholder="Minister name..." />
                <Input placeholder="Email address..." />
                <Input placeholder="Church name..." />
              </div>
              <Link href="/ministers" className="block">
                <Button className="w-full" size="lg" variant="secondary">
                  <Search className="mr-2 h-4 w-4" />
                  Search Ministers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Churches Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-gray-600">Ministers Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">36</div>
              <div className="text-gray-600">States Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

