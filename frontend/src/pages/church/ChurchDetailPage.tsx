import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Globe, Mail, Phone, Facebook, Youtube, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type Church, initialChurches } from "@/lib/data"

// Sample church data (in a real app, this would come from a database)
// const churchData = {
//   1: {
//     id: 1,
//     name: "Grace Community Church",
//     description:
//       "Grace Community Church is a vibrant, multicultural congregation dedicated to worship, fellowship, and service. We believe in building strong relationships with God and each other while making a positive impact in our community through various outreach programs and social initiatives.",
//     yearEstablished: 1985,
//     state: "Lagos",
//     lga: "Ikeja",
//     community: "Allen Avenue",
//     address: "15 Allen Avenue, Ikeja, Lagos State",
//     website: "https://gracecommunity.org",
//     email: "info@gracecommunity.org",
//     phone: "+234 801 234 5678",
//     facebook: "gracecommunitylagos",
//     youtube: "gracecommunitylagos",
//     ministers: [
//       { id: 1, name: "Rev. John Adebayo", role: "Senior Pastor" },
//       { id: 2, name: "Pastor Sarah Okafor", role: "Associate Pastor" },
//     ],
//     services: [
//       { day: "Sunday", time: "8:00 AM & 10:30 AM", type: "Sunday Service" },
//       { day: "Wednesday", time: "6:00 PM", type: "Bible Study" },
//       { day: "Friday", time: "6:00 PM", type: "Prayer Meeting" },
//     ],
//     programs: ["Youth Ministry", "Children's Church", "Women's Fellowship", "Men's Fellowship", "Community Outreach"],
//   },
// }

export default function ChurchDetailPage() {
  const { id } = useParams();
  const [churches] = useLocalStorage<Church[]>("churches", initialChurches)
  const church = churches.find((c) => String(c.id) === id)

  if (!church) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Church Not Found</h2>
            <p className="text-gray-600 mb-4">The church you're looking for doesn't exist.</p>
            <Link to="/churches">
              <Button>Back to Churches</Button>
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
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ChurchConnect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/churches" className="text-blue-600 font-medium">
                Churches
              </Link>
              <Link to="/ministers" className="text-gray-700 hover:text-blue-600 font-medium">
                Ministers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/churches" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Churches
        </Link>

        {/* Church Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{church.name}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="mr-2 h-5 w-5" />
                <span>{church.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Established {church.yearEstablished}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {church.state}
            </Badge>
          </div>

          <p className="text-gray-700 leading-relaxed">{church.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {church.phone && (
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-gray-400" />
                  <span>{church.phone}</span>
                </div>
              )}
              {church.email && (
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <span>{church.email}</span>
                </div>
              )}
              {church.website && (
                <div className="flex items-center">
                  <Globe className="mr-3 h-5 w-5 text-gray-400" />
                  <a
                    href={church.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Social Media</h4>
                <div className="flex space-x-3">
                  {church.facebook && (
                    <Button variant="outline" size="sm">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Button>
                  )}
                  {church.youtube && (
                    <Button variant="outline" size="sm">
                      <Youtube className="mr-2 h-4 w-4" />
                      YouTube
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Times */}
          <Card>
            <CardHeader>
              <CardTitle>Service Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {church.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{service.type}</div>
                      <div className="text-sm text-gray-600">{service.day}</div>
                    </div>
                    <div className="text-sm font-medium">{service.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ministers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Ministers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {church.ministers.map((ministerName, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{ministerName}</div>
                    </div>
                  </div>
                ))}
                {church.ministers.length === 0 && <p className="text-gray-500 text-sm">No ministers listed</p>}
              </div>
            </CardContent>
          </Card>

          {/* Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Programs & Ministries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {church.programs.map((program, index) => (
                  <Badge key={index} variant="outline">
                    {program}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

