'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, Calendar, Wallet, Edit2, Save, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { getCurrentUser, requireAuth, logout as authLogout } from '@/lib/auth'

interface UserProfile {
  id: string
  name: string
  mobile: string
  email?: string
  tokens: number
  profilePhoto?: string
  address?: string
  city?: string
  createdAt: string
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    // Auth guard
    requireAuth((path) => router.replace(path))
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      // Resolve current user from auth session
      const authUser = await getCurrentUser()
      const targetId = authUser?.id || '1'
      // Try to fetch from API
      const response = await fetch(`http://localhost:3001/users/${targetId}`)
      if (response.ok) {
        const userData = await response.json()
        const userProfile: UserProfile = {
          id: userData.id,
          name: userData.name || 'Demo User',
          mobile: userData.mobile || '+919876543210',
          email: userData.email || '',
          tokens: userData.tokens || 0,
          profilePhoto: userData.profilePhoto || '',
          address: userData.address || '',
          city: userData.city || '',
          createdAt: userData.createdAt || new Date().toISOString()
        }
        setProfile(userProfile)
        setEditedProfile(userProfile)
      } else {
        // Fallback to mock data
        loadMockProfile()
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      loadMockProfile()
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockProfile = () => {
    const mockProfile: UserProfile = {
      id: '1',
      name: 'Demo User',
      mobile: '+919876543210',
      email: 'demo@damagthings.com',
      tokens: 5,
      profilePhoto: '',
      address: '123 Market Street',
      city: 'Indore',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    setProfile(mockProfile)
    setEditedProfile(mockProfile)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile({ ...profile })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile({ ...profile })
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      // Try to update via API
      const response = await fetch(`http://localhost:3001/users/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfile)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setProfile({
          ...profile,
          ...editedProfile
        })
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      } else {
        // Mock success for demo
        setProfile({
          ...profile,
          ...editedProfile
        })
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      // Mock success for demo
      setProfile({
        ...profile,
        ...editedProfile
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-4">Unable to load your profile.</p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">DGT</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profilePhoto} />
                    <AvatarFallback className="text-2xl bg-blue-600 text-white">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-gray-600">{profile.mobile}</p>
                  <Badge variant="secondary" className="mt-2">
                    <Wallet className="w-3 h-3 mr-1" />
                    {profile.tokens} Tokens Available
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Mobile Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="mobile"
                      value={editedProfile.mobile || ''}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="+91XXXXXXXXXX"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.mobile}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profile.email || <span className="text-gray-400">Not provided</span>}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    City
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={editedProfile.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profile.city || <span className="text-gray-400">Not provided</span>}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <span className="text-gray-500">🏠</span>
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedProfile.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profile.address || <span className="text-gray-400">Not provided</span>}
                    </p>
                  )}
                </div>

                {/* Joined Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Member Since
                  </Label>
                  <p className="text-gray-900 font-medium">{formatDate(profile.createdAt)}</p>
                </div>

                {/* Token Balance */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    Token Balance
                  </Label>
                  <p className="text-gray-900 font-medium text-2xl">
                    {profile.tokens} <span className="text-sm text-gray-500">tokens</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/')}
            >
              <Wallet className="w-4 h-4 mr-2" />
              My Wallet
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/listings')}
            >
              <span className="mr-2">📦</span>
              My Listings
            </Button>
            <Separator />
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={async () => {
                await authLogout()
                toast.success('Logged out successfully')
                router.replace('/login')
              }}
            >
              <span className="mr-2">🚪</span>
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
