import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { type Minister, type Church, validateEmail, validateUrl, validatePhone } from "@/lib/data"

interface MinisterFormProps {
  minister?: Minister
  churches: Church[]
  onSubmit: (minister: Omit<Minister, "id">) => void
  onCancel: () => void
  isEditing?: boolean
}

export function MinisterForm({ minister, churches, onSubmit, onCancel, isEditing = false }: MinisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: minister?.firstName || "",
    lastName: minister?.lastName || "",
    email: minister?.email || "",
    phone: minister?.phone || "",
    website: minister?.website || "",
    facebook: minister?.facebook || "",
    bio: minister?.bio || "",
    profilePicture: minister?.profilePicture || "",
    churchName: minister?.churchName || "",
    churchId: minister?.churchId || 0,
    role: minister?.role || "",
    education: minister?.education || [],
    experience: minister?.experience || [],
    specializations: minister?.specializations || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newEducation, setNewEducation] = useState("")
  const [newExperience, setNewExperience] = useState("")
  const [newSpecialization, setNewSpecialization] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (!formData.churchId) newErrors.churchId = "Please select a church"
    if (!formData.role.trim()) newErrors.role = "Role is required"
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
      const selectedChurch = churches.find((c) => c.id === formData.churchId)
      onSubmit({
        ...formData,
        churchName: selectedChurch?.name || "",
      })
    }
  }

  const handleChurchChange = (churchId: string) => {
    const id = Number.parseInt(churchId)
    const selectedChurch = churches.find((c) => c.id === id)
    setFormData((prev) => ({
      ...prev,
      churchId: id,
      churchName: selectedChurch?.name || "",
    }))
  }

  const addEducation = () => {
    if (newEducation.trim()) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation.trim()],
      }))
      setNewEducation("")
    }
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addExperience = () => {
    if (newExperience.trim()) {
      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, newExperience.trim()],
      }))
      setNewExperience("")
    }
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }))
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Minister" : "Add New Minister"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className={errors.bio ? "border-red-500" : ""}
              rows={4}
              placeholder="Tell us about the minister's background, experience, and ministry focus..."
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          {/* Church and Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="church">Church *</Label>
              <Select value={formData.churchId.toString()} onValueChange={handleChurchChange}>
                <SelectTrigger className={errors.churchId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a church" />
                </SelectTrigger>
                <SelectContent>
                  {churches.map((church) => (
                    <SelectItem key={church.id} value={church.id.toString()}>
                      {church.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.churchId && <p className="text-red-500 text-sm mt-1">{errors.churchId}</p>}
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                className={errors.role ? "border-red-500" : ""}
                placeholder="e.g., Senior Pastor, Associate Pastor"
              />
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profilePicture">Profile Picture URL</Label>
            <Input
              id="profilePicture"
              value={formData.profilePicture}
              onChange={(e) => setFormData((prev) => ({ ...prev, profilePicture: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Education */}
          <div>
            <Label>Education</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                placeholder="Add education (e.g., Master of Divinity - Seminary Name)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
              />
              <Button type="button" onClick={addEducation} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.education.map((edu, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{edu}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeEducation(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <Label>Ministry Experience</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newExperience}
                onChange={(e) => setNewExperience(e.target.value)}
                placeholder="Add experience (e.g., Senior Pastor, Church Name (2010 - Present))"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExperience())}
              />
              <Button type="button" onClick={addExperience} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.experience.map((exp, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{exp}</span>
                  <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => removeExperience(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <Label>Ministry Specializations</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {spec}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialization(index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update Minister" : "Add Minister"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
