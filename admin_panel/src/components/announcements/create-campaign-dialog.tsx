'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronRight, ChevronLeft, Bell, Mail, MessageSquare, Smartphone, AlertCircle, Users, Calendar as CalendarIcon, Languages, Eye, Send, Clock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCampaignDialog({ open, onOpenChange }: CreateCampaignDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basics
    name: '',
    goal: '',
    
    // Step 2: Channels
    channels: [] as string[],
    
    // Step 3: Audience
    segments: [] as string[],
    cities: [] as string[],
    categories: [] as string[],
    roles: [] as string[],
    
    // Step 4: Content
    title: '',
    body: '',
    ctaText: '',
    ctaLink: '',
    
    // Step 5: Localization
    languages: ['en'] as string[],
    translations: {} as Record<string, { title: string; body: string; ctaText: string }>,
    
    // Step 6: Scheduling
    sendNow: true,
    scheduleDate: null as Date | null,
    throttling: 1000,
    quietHours: { enabled: false, from: '22:00', to: '08:00' },
    frequencyCap: { enabled: true, maxPerDay: 3 },
  })

  const [audienceSize, setAudienceSize] = useState(0)
  const [projectedSendRate, setProjectedSendRate] = useState(0)

  const totalSteps = 6

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayValue = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter((v: string) => v !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log('Creating campaign:', formData)
    onOpenChange(false)
    setStep(1)
    // Reset form
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Renew Expiring Listings - Delhi Mobiles"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal *</Label>
              <Select value={formData.goal} onValueChange={(value) => updateFormData('goal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renew-listings">Renew Listings</SelectItem>
                  <SelectItem value="drive-boosts">Drive Boosts</SelectItem>
                  <SelectItem value="safety-tips">Safety Tips</SelectItem>
                  <SelectItem value="kyc-completion">KYC Completion</SelectItem>
                  <SelectItem value="wallet-topup">Wallet Top-up</SelectItem>
                  <SelectItem value="engagement">General Engagement</SelectItem>
                  <SelectItem value="win-back">Win-back Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <Label>Select Channels *</Label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'push', label: 'Push Notification', icon: Bell, color: 'text-blue-500' },
                { id: 'in-app', label: 'In-App Inbox', icon: Smartphone, color: 'text-orange-500' },
                { id: 'sms', label: 'SMS', icon: MessageSquare, color: 'text-green-500' },
                { id: 'email', label: 'Email', icon: Mail, color: 'text-purple-500' }
              ].map(({ id, label, icon: Icon, color }) => (
                <Card
                  key={id}
                  className={`cursor-pointer transition-all ${
                    formData.channels.includes(id) ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => toggleArrayValue('channels', id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={formData.channels.includes(id)} />
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="font-medium">{label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Audience Segments</Label>
              <div className="space-y-2">
                {['New Users (<7d)', 'Power Sellers', 'Verified KYC', 'At Risk (14d inactive)', 'High-Value Buyers'].map(seg => (
                  <div key={seg} className="flex items-center space-x-2">
                    <Checkbox
                      id={seg}
                      checked={formData.segments.includes(seg)}
                      onCheckedChange={() => toggleArrayValue('segments', seg)}
                    />
                    <Label htmlFor={seg} className="text-sm font-normal">{seg}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cities</Label>
              <div className="flex flex-wrap gap-2">
                {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'All'].map(city => (
                  <Badge
                    key={city}
                    variant={formData.cities.includes(city) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('cities', city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {['Mobiles', 'Electronics', 'Vehicles', 'Real Estate', 'Jobs', 'All'].map(cat => (
                  <Badge
                    key={cat}
                    variant={formData.categories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('categories', cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>User Roles</Label>
              <div className="flex gap-2">
                {['Buyers', 'Sellers', 'Both'].map(role => (
                  <Badge
                    key={role}
                    variant={formData.roles.includes(role) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('roles', role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Estimated Audience: <strong>~12,450 users</strong>
                {formData.segments.length > 1 && (
                  <span className="text-amber-600 ml-2">(~8% overlap detected)</span>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Your listing expires in 3 days!"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">{formData.title.length}/60</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message Body *</Label>
              <Textarea
                id="body"
                placeholder="Renew now and get 20% off on boost plans!"
                value={formData.body}
                onChange={(e) => updateFormData('body', e.target.value)}
                rows={4}
                maxLength={formData.channels.includes('sms') ? 160 : 500}
              />
              <p className="text-xs text-muted-foreground">
                {formData.body.length}/{formData.channels.includes('sms') ? 160 : 500}
                {formData.channels.includes('sms') && ' (SMS limit)'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText">Call-to-Action Text</Label>
              <Input
                id="ctaText"
                placeholder="e.g., Renew Now"
                value={formData.ctaText}
                onChange={(e) => updateFormData('ctaText', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">Deep Link</Label>
              <Input
                id="ctaLink"
                placeholder="/renew or /boost-plans"
                value={formData.ctaLink}
                onChange={(e) => updateFormData('ctaLink', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Examples: /listing/123, /renew, /boost-plans, /wallet, /kyc
              </p>
            </div>

            {formData.ctaLink && !formData.ctaLink.startsWith('/') && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Deep links should start with / (e.g., /renew)
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex gap-2">
                {['en', 'hi', 'mr', 'ta', 'te'].map(lang => {
                  const labels: Record<string, string> = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', te: 'Telugu' }
                  return (
                    <Badge
                      key={lang}
                      variant={formData.languages.includes(lang) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayValue('languages', lang)}
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      {labels[lang]}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {formData.languages.filter(l => l !== 'en').map(lang => (
              <Card key={lang}>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold">{lang.toUpperCase()} Translation</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Translated title"
                      value={formData.translations[lang]?.title || ''}
                      onChange={(e) => updateFormData('translations', {
                        ...formData.translations,
                        [lang]: { ...formData.translations[lang], title: e.target.value }
                      })}
                    />
                    <Textarea
                      placeholder="Translated body"
                      value={formData.translations[lang]?.body || ''}
                      onChange={(e) => updateFormData('translations', {
                        ...formData.translations,
                        [lang]: { ...formData.translations[lang], body: e.target.value }
                      })}
                      rows={3}
                    />
                    <Input
                      placeholder="Translated CTA"
                      value={formData.translations[lang]?.ctaText || ''}
                      onChange={(e) => updateFormData('translations', {
                        ...formData.translations,
                        [lang]: { ...formData.translations[lang], ctaText: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {formData.languages.length === 1 && (
              <Alert>
                <Languages className="h-4 w-4" />
                <AlertDescription>
                  Add language variants to reach a wider audience
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Immediately</Label>
                <p className="text-sm text-muted-foreground">Send as soon as campaign is published</p>
              </div>
              <Switch
                checked={formData.sendNow}
                onCheckedChange={(checked) => updateFormData('sendNow', checked)}
              />
            </div>

            {!formData.sendNow && (
              <div className="space-y-2">
                <Label>Schedule Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduleDate ? formData.scheduleDate.toLocaleString() : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.scheduleDate || undefined}
                      onSelect={(date) => updateFormData('scheduleDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label>Throttling (messages per second)</Label>
              <Input
                type="number"
                value={formData.throttling}
                onChange={(e) => updateFormData('throttling', parseInt(e.target.value))}
                min={100}
                max={10000}
              />
              <p className="text-xs text-muted-foreground">Recommended: 1000/s to avoid provider limits</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Avoid sending during night hours</p>
              </div>
              <Switch
                checked={formData.quietHours.enabled}
                onCheckedChange={(checked) =>
                  updateFormData('quietHours', { ...formData.quietHours, enabled: checked })
                }
              />
            </div>

            {formData.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="time"
                    value={formData.quietHours.from}
                    onChange={(e) =>
                      updateFormData('quietHours', { ...formData.quietHours, from: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    type="time"
                    value={formData.quietHours.to}
                    onChange={(e) =>
                      updateFormData('quietHours', { ...formData.quietHours, to: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Frequency Cap</Label>
                <p className="text-sm text-muted-foreground">Limit notifications per user per day</p>
              </div>
              <Switch
                checked={formData.frequencyCap.enabled}
                onCheckedChange={(checked) =>
                  updateFormData('frequencyCap', { ...formData.frequencyCap, enabled: checked })
                }
              />
            </div>

            {formData.frequencyCap.enabled && (
              <div className="space-y-2 pl-6">
                <Label>Max per day</Label>
                <Input
                  type="number"
                  value={formData.frequencyCap.maxPerDay}
                  onChange={(e) =>
                    updateFormData('frequencyCap', { ...formData.frequencyCap, maxPerDay: parseInt(e.target.value) })
                  }
                  min={1}
                  max={10}
                />
              </div>
            )}

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Projected send rate: <strong>{formData.throttling}/s</strong>
                <br />
                Total delivery time: <strong>~12.5 minutes</strong> for 12,450 users
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.goal
      case 2:
        return formData.channels.length > 0
      case 3:
        return formData.segments.length > 0 || formData.cities.length > 0
      case 4:
        return formData.title && formData.body
      case 5:
        return true // Optional translations
      case 6:
        return formData.sendNow || formData.scheduleDate
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Broadcast Campaign</DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {
              ['Basics', 'Channels', 'Audience', 'Content', 'Localization', 'Schedule'][step - 1]
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="py-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNext}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button onClick={handleSubmit} disabled={!canProceed()}>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Campaign
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
