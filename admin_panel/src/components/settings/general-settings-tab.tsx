'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Info, Globe, Mail, Clock, Palette, BarChart3 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface GeneralSettingsTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

export default function GeneralSettingsTab({ auditMode, onChanged, searchQuery }: GeneralSettingsTabProps) {
  const [settings, setSettings] = useState({
    // Platform Identity
    appName: 'DGT Marketplace',
    tagline: 'Your trusted marketplace',
    supportEmail: 'support@dgt.com',
    supportPhone: '+91 1234567890',
    address: 'Mumbai, India',
    
    // Time & Region
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    defaultLanguage: 'en',
    
    // Email & SMS
    emailFromName: 'DGT Marketplace',
    emailFromAddress: 'noreply@dgt.com',
    smsSenderId: 'DGTMKT',
    
    // UI Preferences
    theme: 'light',
    dashboardLayout: 'grid',
    paginationLimit: 20,
    
    // Limits
    maxListingsPerUser: 50,
    maxMessagesPerDay: 100,
    defaultListingExpiry: 30,
  })

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    onChanged()
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['identity', 'contact', 'region', 'email', 'ui', 'limits']} className="space-y-4">
        
        {/* Platform Identity */}
        <AccordionItem value="identity" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Platform Identity</div>
                <div className="text-sm text-muted-foreground">Logo, app name, tagline, favicon, social handles</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">App Name</Label>
                    <Input
                      id="appName"
                      value={settings.appName}
                      onChange={(e) => handleChange('appName', e.target.value)}
                    />
                    {auditMode && (
                      <p className="text-xs text-muted-foreground">Last edited by Admin on Dec 1, 2025</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={settings.tagline}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo Upload</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">PNG or SVG, max 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Favicon
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialHandles">Social Media Handles</Label>
                  <Textarea
                    id="socialHandles"
                    placeholder="Facebook: @dgt&#10;Twitter: @dgtmarket&#10;Instagram: @dgt_marketplace"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Contact Details */}
        <AccordionItem value="contact" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">Contact Details</div>
                <div className="text-sm text-muted-foreground">Support email, phone, address</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      value={settings.supportPhone}
                      onChange={(e) => handleChange('supportPhone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Time & Region */}
        <AccordionItem value="region" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <div className="font-semibold">Time & Region</div>
                <div className="text-sm text-muted-foreground">Timezone, currency, date format, language defaults</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(v) => handleChange('timezone', v)}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={settings.currency} onValueChange={(v) => handleChange('currency', v)}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(v) => handleChange('dateFormat', v)}>
                      <SelectTrigger id="dateFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={settings.defaultLanguage} onValueChange={(v) => handleChange('defaultLanguage', v)}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Email & SMS Senders */}
        <AccordionItem value="email" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold">Email & SMS Senders</div>
                <div className="text-sm text-muted-foreground">Default from-names, sender IDs</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailFromName">Email From Name</Label>
                    <Input
                      id="emailFromName"
                      value={settings.emailFromName}
                      onChange={(e) => handleChange('emailFromName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailFromAddress">Email From Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) => handleChange('emailFromAddress', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smsSenderId">SMS Sender ID</Label>
                    <Input
                      id="smsSenderId"
                      value={settings.smsSenderId}
                      onChange={(e) => handleChange('smsSenderId', e.target.value)}
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Max 6 characters (alphanumeric)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* UI Preferences */}
        <AccordionItem value="ui" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-pink-600" />
              <div className="text-left">
                <div className="font-semibold">UI Preferences</div>
                <div className="text-sm text-muted-foreground">Theme, dashboard layout, pagination limits</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Default Theme</Label>
                    <Select value={settings.theme} onValueChange={(v) => handleChange('theme', v)}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
                    <Select value={settings.dashboardLayout} onValueChange={(v) => handleChange('dashboardLayout', v)}>
                      <SelectTrigger id="dashboardLayout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pagination">Default Pagination Limit</Label>
                    <Select value={settings.paginationLimit.toString()} onValueChange={(v) => handleChange('paginationLimit', parseInt(v))}>
                      <SelectTrigger id="pagination">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 items</SelectItem>
                        <SelectItem value="20">20 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                        <SelectItem value="100">100 items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* System Limits */}
        <AccordionItem value="limits" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <div className="text-left">
                <div className="font-semibold">System Limits</div>
                <div className="text-sm text-muted-foreground">Max listings per user, max messages/day, default expiry</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxListings">Max Listings Per User</Label>
                    <Input
                      id="maxListings"
                      type="number"
                      value={settings.maxListingsPerUser}
                      onChange={(e) => handleChange('maxListingsPerUser', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMessages">Max Messages Per Day</Label>
                    <Input
                      id="maxMessages"
                      type="number"
                      value={settings.maxMessagesPerDay}
                      onChange={(e) => handleChange('maxMessagesPerDay', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listingExpiry">Default Listing Expiry (days)</Label>
                    <Input
                      id="listingExpiry"
                      type="number"
                      value={settings.defaultListingExpiry}
                      onChange={(e) => handleChange('defaultListingExpiry', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    These limits help maintain platform quality and prevent abuse. Changes affect new users immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}
