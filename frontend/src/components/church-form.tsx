"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { type Church, validateEmail, validateUrl, validatePhone } from "@/lib/data"

interface ChurchFormProps {
  church?: Church
  onSubmit: (church: Omit<Church, "id">) => void
  onCancel: () => void
  isEditing?: boolean
}

export function ChurchForm({ church, onSubmit, onCancel, isEditing = false }: ChurchFormProps) {
  const [formData, setFormData] = useState({
    name: church?.name || "",
    description: church?.description || "",
    yearEstablished: church?.yearEstablished || new Date().getFullYear(),
    state: church?.state || "",
    lga: church?.lga || "",
    community: church?.community || "",
    address: church?.address || "",
    website: church?.website || "",
    email: church?.email || "",
    phone: church?.phone || "",
    facebook: church?.facebook || "",
    youtube: church?.youtube || "",
    ministers: church?.ministers || [],
    services: church?.services || [],
    programs: church?.programs || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newMinister, setNewMinister] = useState("")
  const [newService, setNewService] = useState({ day: "", time: "", type: "" })
  const [newProgram, setNewProgram] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Church name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.lga.trim()) newErrors.lga = "LGA is required"
    if (!formData.community.trim()) newErrors.community = "Community is required"
    if (formData.yearEstablished < 1800 || formData.yearEstablished > new Date().getFullYear()) {
      newErrors.yearEstablished = "Please enter a valid year"
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const addMinister = () => {
    if (newMinister.trim()) {
      setFormData((prev) => ({
        ...prev,
        ministers: [...prev.ministers, newMinister.trim()],
      }))
      setNewMinister("")
    }
  }

  const removeMinister = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ministers: prev.ministers.filter((_, i) => i !== index),
    }))
  }

  const addService = () => {
    if (newService.day && newService.time && newService.type) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService],
      }))
      setNewService({ day: "", time: "", type: "" })
    }
  }

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const addProgram = () => {
    if (newProgram.trim()) {
      setFormData((prev) => ({
        ...prev,
        programs: [...prev.programs, newProgram.trim()],
      }))
      setNewProgram("")
    }
  }

  const removeProgram = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Church" : "Add New Church"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Church Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="yearEstablished">Year Established *</Label>
              <Input
                id="yearEstablished"
                type="number"
                value={formData.yearEstablished}
                onChange={(e) => setFormData((prev) => ({ ...prev, yearEstablished: Number.parseInt(e.target.value) }))}
                className={errors.yearEstablished ? "border-red-500" : ""}
              />
              {errors.yearEstablished && <p className="text-red-500 text-sm mt-1">{errors.yearEstablished}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <Label htmlFor="lga">LGA *</Label>
              <Input
                id="lga"
                value={formData.lga}
                onChange={(e) => setFormData((prev) => ({ ...prev, lga: e.target.value }))}
                className={errors.lga ? "border-red-500" : ""}
              />
              {errors.lga && <p className="text-red-500 text-sm mt-1">{errors.lga}</p>}
            </div>

            <div>
              <Label htmlFor="community">Community *</Label>
              <Input
                id="community"
                value={formData.community}
                onChange={(e) => setFormData((prev) => ({ ...prev, community: e.target.value }))}
                className={errors.community ? "border-red-500" : ""}
              />
              {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className={errors.website ? "border-red-500" : ""}
                placeholder="https://example.com"
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>

            <div>
              <Label htmlFor="facebook">Facebook Handle</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}
                placeholder="churchname"
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube Channel</Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => setFormData((prev) => ({ ...prev, youtube: e.target.value }))}
                placeholder="channelname"
              />
            </div>
          </div>

          {/* Ministers */}
          <div>
            <Label>Ministers</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newMinister}
                onChange={(e) => setNewMinister(e.target.value)}
                placeholder="Add minister name"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMinister())}
              />
              <Button type="button" onClick={addMinister} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ministers.map((minister, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {minister}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeMinister(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <Label>Service Times</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Input
                value={newService.day}
                onChange={(e) => setNewService((prev) => ({ ...prev, day: e.target.value }))}
                placeholder="Day"
              />
              <Input
                value={newService.time}
                onChange={(e) => setNewService((prev) => ({ ...prev, time: e.target.value }))}
                placeholder="Time"
              />
              <div className="flex gap-2">
                <Input
                  value={newService.type}
                  onChange={(e) => setNewService((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="Service Type"
                />
                <Button type="button" onClick={addService} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>
                    {service.type} - {service.day} at {service.time}
                  </span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeService(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <Label>Programs & Ministries</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newProgram}
                onChange={(e) => setNewProgram(e.target.value)}
                placeholder="Add program name"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProgram())}
              />
              <Button type="button" onClick={addProgram} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.programs.map((program, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {program}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeProgram(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Church" : "Add Church"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
