"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Users, Mail, ChurchIcon, Filter, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { MinisterForm } from "@/components/minister-form"
import { type Minister, initialMinisters, initialChurches, generateId, type Church } from "@/lib/data"
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

export default function MinistersPage() {
  const [ministers, setMinisters] = useLocalStorage<Minister[]>("ministers", initialMinisters)
  const [churches] = useLocalStorage<Church[]>("churches", initialChurches)
  const [showForm, setShowForm] = useState(false)
  const [editingMinister, setEditingMinister] = useState<Minister | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [emailSearch, setEmailSearch] = useState("")
  const [churchSearch, setChurchSearch] = useState("")

  const handleAddMinister = (ministerData: Omit<Minister, "id">) => {
    const newMinister: Minister = {
      ...ministerData,
      id: generateId(ministers),
    }
    setMinisters((prev) => [...prev, newMinister])
    setShowForm(false)
  }

  const handleEditMinister = (ministerData: Omit<Minister, "id">) => {
    if (editingMinister) {
      setMinisters((prev) =>
        prev.map((minister) =>
          minister.id === editingMinister.id ? { ...ministerData, id: editingMinister.id } : minister,
        ),
      )
      setEditingMinister(null)
      setShowForm(false)
    }
  }

  const handleDeleteMinister = (id: number) => {
    setMinisters((prev) => prev.filter((minister) => minister.id !== id))
  }

  const startEdit = (minister: Minister) => {
    setEditingMinister(minister)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingMinister(null)
  }

  const filteredMinisters = ministers.filter((minister) => {
    const fullName = `${minister.firstName} ${minister.lastName}`.toLowerCase()
    const matchesName = fullName.includes(searchTerm.toLowerCase())
    const matchesEmail = minister.email.toLowerCase().includes(emailSearch.toLowerCase())
    const matchesChurch = minister.churchName.toLowerCase().includes(churchSearch.toLowerCase())

    return matchesName && matchesEmail && matchesChurch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ChurchIcon className="h-8 w-8 text-blue-600" />
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

      {/* Minister Form */}
      {showForm && (
        <div className="mb-8">
          <MinisterForm
            minister={editingMinister || undefined}
            churches={churches}
            onSubmit={editingMinister ? handleEditMinister : handleAddMinister}
            onCancel={cancelForm}
            isEditing={!!editingMinister}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Minister Directory</h1>
            <p className="text-gray-600">Connect with spiritual leaders and minister.</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Minister
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Search Ministers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by first or last name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Input
                placeholder="Search by email address..."
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
              />
              <Input
                placeholder="Search by church name..."
                value={churchSearch}
                onChange={(e) => setChurchSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredMinisters.length} of {ministers.length} ministers
          </p>
        </div>

        {/* Minister Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinisters.map((minister) => (
            <Card key={minister.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage
                    src={minister.profilePicture || "/placeholder.svg"}
                    alt={`${minister.firstName} ${minister.lastName}`}
                  />
                  <AvatarFallback className="text-lg">
                    {minister.firstName[0]}
                    {minister.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                  {minister.firstName} {minister.lastName}
                </CardTitle>
                <CardDescription className="text-base">{minister.role}</CardDescription>
                <Badge variant="outline" className="w-fit mx-auto">
                  {minister.churchName}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{minister.bio}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="truncate">{minister.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ChurchIcon className="mr-2 h-4 w-4" />
                    <Link to={`/churches/${minister.churchId}`} className="text-blue-600 hover:underline truncate">
                      {minister.churchName}
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {minister.website && (
                      <Button variant="outline" size="sm">
                        Website
                      </Button>
                    )}
                    {minister.phone && (
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(minister)}>
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
                          <AlertDialogTitle>Delete Minister</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {minister.firstName} {minister.lastName}? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMinister(minister.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link to={`/ministers/${minister.id}`}>
                      <Button size="sm">View Profile</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMinisters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ministers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

