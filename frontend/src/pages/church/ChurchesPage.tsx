"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, Calendar, ExternalLink, Church, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { ChurchForm } from "@/components/church-form"
import { Edit, Trash2, Plus } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Sample church data
const initialChurches = [
  {
    id: 1,
    name: "Grace Community Church",
    description: "A vibrant community focused on worship, fellowship, and service to others.",
    yearEstablished: 1985,
    state: "Lagos",
    lga: "Ikeja",
    community: "Allen Avenue",
    website: "https://gracecommunity.org",
    email: "info@gracecommunity.org",
    phone: "+234 801 234 5678",
    facebook: "gracecommunitylagos",
    youtube: "gracecommunitylagos",
    ministers: ["Rev. John Adebayo", "Pastor Sarah Okafor"],
  },
  {
    id: 2,
    name: "Faith Baptist Church",
    description: "Building strong families and communities through biblical teaching and love.",
    yearEstablished: 1992,
    state: "Abuja",
    lga: "Abuja Municipal",
    community: "Wuse 2",
    email: "contact@faithbaptist.ng",
    phone: "+234 809 876 5432",
    ministers: ["Pastor David Okonkwo"],
  },
  {
    id: 3,
    name: "New Life Assembly",
    description: "Empowering believers to live purposeful lives in Christ.",
    yearEstablished: 2001,
    state: "Rivers",
    lga: "Port Harcourt",
    community: "GRA Phase 2",
    website: "https://newlifeassembly.org",
    facebook: "newlifeassemblyph",
    ministers: ["Rev. Grace Eze", "Pastor Michael Okoro"],
  },
]

function generateId(churches: any) {
  return churches.length > 0 ? Math.max(...churches.map((church: any) => church.id)) + 1 : 1
}

export default function ChurchesPage() {
  const [churches, setChurches] = useLocalStorage("churches", initialChurches)
  const [showForm, setShowForm] = useState(false)
  const [editingChurch, setEditingChurch] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("All States")
  const [selectedLGA, setSelectedLGA] = useState("All LGAs")

  const handleAddChurch = (churchData) => {
    const newChurch = {
      ...churchData,
      id: generateId(churches),
    }
    setChurches((prev) => [...prev, newChurch])
    setShowForm(false)
  }

  const handleEditChurch = (churchData) => {
    if (editingChurch) {
      setChurches((prev) =>
        prev.map((church) => (church.id === editingChurch.id ? { ...churchData, id: editingChurch.id } : church)),
      )
      setEditingChurch(null)
      setShowForm(false)
    }
  }

  const handleDeleteChurch = (id) => {
    setChurches((prev) => prev.filter((church) => church.id !== id))
  }

  const startEdit = (church) => {
    setEditingChurch(church)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingChurch(null)
  }

  const filteredChurches = churches.filter((church) => {
    const matchesSearch =
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      church.community.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === "All States" || church.state === selectedState
    const matchesLGA = selectedLGA === "All LGAs" || church.lga === selectedLGA

    return matchesSearch && matchesState && matchesLGA
  })

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
              <Link to="/churches" className="text-blue-600 font-medium">
                Churches
              </Link>
              <Link to="/ministers" className="text-gray-700 hover:text-blue-600 font-medium">
                Ministers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Church Form */}
      {showForm && (
        <div className="mb-8">
          <ChurchForm
            church={editingChurch || undefined}
            onSubmit={editingChurch ? handleEditChurch : handleAddChurch}
            onCancel={cancelForm}
            isEditing={!!editingChurch}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Directory</h1>
            <p className="text-gray-600">Find churches in your area and connect with local communities of faith.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Church
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by church name or community..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All States">All States</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                  <SelectItem value="Rivers">Rivers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLGA} onValueChange={setSelectedLGA}>
                <SelectTrigger>
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All LGAs">All LGAs</SelectItem>
                  <SelectItem value="Ikeja">Ikeja</SelectItem>
                  <SelectItem value="Abuja Municipal">Abuja Municipal</SelectItem>
                  <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredChurches.length} of {churches.length} churches
          </p>
        </div>

        {/* Church Cards */}
        <div className="grid gap-6">
          {filteredChurches.map((church) => (
            <Card key={church.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{church.name}</CardTitle>
                    <CardDescription className="text-base mb-3">{church.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="mr-1 h-4 w-4" />
                      {church.community}, {church.lga}, {church.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-1 h-4 w-4" />
                      Established {church.yearEstablished}
                    </div>
                  </div>
                  <Badge variant="secondary">{church.state}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {church.ministers.map((minister, index) => (
                    <Badge key={index} variant="outline">
                      {minister}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {church.website && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Website
                      </Button>
                    )}
                    {church.phone && (
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(church)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Church</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {church.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteChurch(church.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link to={`/churches/${church.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChurches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Church className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No churches found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

