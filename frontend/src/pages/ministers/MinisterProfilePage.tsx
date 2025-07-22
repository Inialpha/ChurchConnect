import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, Facebook, Church } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { type Minister, initialMinisters } from "@/lib/data";

export default function MinisterProfilePage() {
  const { id } = useParams();
  const [ministers] = useLocalStorage<Minister[]>("ministers", initialMinisters)
  const minister = ministers.find((m) => String(m.id) === id)


  if (!minister) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Minister Not Found</h2>
            <p className="text-gray-600 mb-4">The minister profile you're looking for doesn't exist.</p>
            <Link to="/ministers">
              <Button>Back to Ministers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ChurchConnect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/churches" className="text-gray-700 hover:text-blue-600 font-medium">
                Churches
              </Link>
              <Link to="/ministers" className="text-blue-600 font-medium">
                Ministers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/ministers" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ministers
        </Link>

        {/* Minister Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={minister.profilePicture || "/placeholder.svg"}
                  alt={`${minister.firstName} ${minister.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {minister.firstName[0]}
                  {minister.lastName[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {minister.firstName} {minister.lastName}
                </h1>
                <p className="text-xl text-gray-600 mb-3">{minister.role}</p>
                <div className="flex justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="text-sm">
                    <Church className="mr-1 h-3 w-3" />
                    {minister.churchName}
                  </Badge>
                </div>
                <p className="text-gray-700 leading-relaxed">{minister.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gray-400" />
                <a href={`mailto:${minister.email}`} className="text-blue-600 hover:underline">
                  {minister.email}
                </a>
              </div>

              {minister.phone && (
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  <a href={`tel:${minister.phone}`} className="text-blue-600 hover:underline">
                    {minister.phone}
                  </a>
                </div>
              )}

              {minister.website && (
                <div className="flex items-center">
                  <Globe className="mr-3 h-5 w-5 text-gray-400" />
                  <a
                    href={minister.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {minister.facebook && (
                <div className="flex items-center">
                  <Facebook className="mr-3 h-5 w-5 text-gray-400" />
                  <a
                    href={`${minister.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Facebook Profile
                  </a>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Associated Church</h4>
                <Link
                  to={`/churches/${minister.churchId}`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Church className="mr-2 h-4 w-4" />
                  {minister.churchName}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card>
            <CardHeader>
              <CardTitle>Ministry Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {minister.specializations?.map((specialization, index) => (
                  <Badge key={index} variant="outline">
                    {specialization}
                  </Badge>
                )) || <p className="text-gray-500 text-sm">No specializations listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {minister.education?.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{edu}</div>
                  </div>
                )) || <p className="text-gray-500 text-sm">No education information available</p>}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Ministry Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {minister.experience?.map((exp, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{exp}</div>
                  </div>
                )) || <p className="text-gray-500 text-sm">No experience information available</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Link to={`/churches/${minister.churchId}`}>
                <Button variant="outline">
                  <Church className="mr-2 h-4 w-4" />
                  Visit Church
                </Button>
              </Link>
              {minister.website && (
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
