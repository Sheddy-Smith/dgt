'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  User, Bell, Lock, CreditCard, Globe, 
  Moon, LogOut, Trash2, ChevronRight, Shield 
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false
  })
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/profile/edit">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
              <div>
                <p className="font-medium">Edit Profile</p>
                <p className="text-sm text-muted-foreground">Update your personal information</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
          <Separator />
          <Link href="/profile/kyc">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
              <div>
                <p className="font-medium">KYC Verification</p>
                <p className="text-sm text-muted-foreground">Verify your identity</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch 
              id="push"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              id="email"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive SMS alerts for important updates</p>
            </div>
            <Switch 
              id="sms"
              checked={notifications.sms}
              onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">Receive promotional offers and news</p>
            </div>
            <Switch 
              id="marketing"
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <div>
              <p className="font-medium">Privacy Settings</p>
              <p className="text-sm text-muted-foreground">Control your data and visibility</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment & Bank
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/settings/bank">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
              <div>
                <p className="font-medium">Bank Accounts</p>
                <p className="text-sm text-muted-foreground">Manage payout accounts</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Link>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <div>
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-muted-foreground">Add or remove payment options</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle dark theme</p>
            </div>
            <Switch 
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-muted-foreground">English</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Legal & Support */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Legal & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <p className="font-medium">Terms of Service</p>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <p className="font-medium">Privacy Policy</p>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <p className="font-medium">Help Center</p>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
            <p className="font-medium">Contact Support</p>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* App Version */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        DGT Marketplace v1.0.0
      </p>
    </div>
  )
}
