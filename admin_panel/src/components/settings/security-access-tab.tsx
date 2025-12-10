'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Lock, 
  Shield, 
  Smartphone,
  MapPin,
  Clock,
  Monitor,
  Key,
  AlertTriangle,
  LogOut,
  Eye,
  Download
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SecurityAccessTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

interface Session {
  id: string
  user: string
  device: string
  location: string
  ip: string
  loginTime: string
  lastActive: string
  status: 'active' | 'idle'
}

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  ip: string
  status: 'success' | 'failed'
}

export default function SecurityAccessTab({ auditMode, onChanged, searchQuery }: SecurityAccessTabProps) {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    ipWhitelist: '',
    autoLogoutMinutes: 30,
    passwordMinLength: 12,
    passwordRotationDays: 90,
    deviceFingerprint: true
  })

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      user: 'admin@dgt.com',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ip: '192.168.1.100',
      loginTime: '2025-12-10 09:00',
      lastActive: '2 min ago',
      status: 'active'
    },
    {
      id: '2',
      user: 'moderator@dgt.com',
      device: 'Safari on MacOS',
      location: 'Delhi, India',
      ip: '192.168.1.101',
      loginTime: '2025-12-10 08:30',
      lastActive: '15 min ago',
      status: 'idle'
    }
  ])

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2025-12-10 10:23:45',
      user: 'admin@dgt.com',
      action: 'Updated Settings',
      resource: 'Payment Gateway',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2025-12-10 10:15:22',
      user: 'moderator@dgt.com',
      action: 'Login Attempt',
      resource: 'Admin Panel',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2025-12-10 09:58:10',
      user: 'unknown@test.com',
      action: 'Login Attempt',
      resource: 'Admin Panel',
      ip: '45.67.89.123',
      status: 'failed'
    }
  ])

  const handleForceLogout = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
    onChanged()
  }

  return (
    <Tabs defaultValue="controls" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="controls">
          <Shield className="h-4 w-4 mr-2" />
          Security Controls
        </TabsTrigger>
        <TabsTrigger value="sessions">
          <Monitor className="h-4 w-4 mr-2" />
          Active Sessions
        </TabsTrigger>
        <TabsTrigger value="audit">
          <Eye className="h-4 w-4 mr-2" />
          Audit Logs
        </TabsTrigger>
      </TabsList>

      {/* Security Controls */}
      <TabsContent value="controls" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security & Access Controls</CardTitle>
            <CardDescription>Configure authentication and access policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 2FA */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-muted-foreground">Require TOTP or SMS for admin logins</p>
                </div>
              </div>
              <Switch
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(v) => { setSecuritySettings({...securitySettings, twoFactorEnabled: v}); onChanged(); }}
              />
            </div>

            {/* IP Whitelist */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              </div>
              <Textarea
                id="ipWhitelist"
                placeholder="Enter IP addresses (one per line)&#10;192.168.1.0/24&#10;203.0.113.0/24"
                rows={4}
                value={securitySettings.ipWhitelist}
                onChange={(e) => { setSecuritySettings({...securitySettings, ipWhitelist: e.target.value}); onChanged(); }}
              />
              <p className="text-xs text-muted-foreground">
                Only these IP addresses can access the admin panel
              </p>
            </div>

            {/* Auto Logout */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <Label htmlFor="autoLogout">Auto-Logout Timeout (minutes)</Label>
              </div>
              <Input
                id="autoLogout"
                type="number"
                value={securitySettings.autoLogoutMinutes}
                onChange={(e) => { setSecuritySettings({...securitySettings, autoLogoutMinutes: parseInt(e.target.value)}); onChanged(); }}
              />
              <p className="text-xs text-muted-foreground">
                Automatically log out inactive users after this duration
              </p>
            </div>

            {/* Password Policies */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-semibold">Password Policies</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passMinLength">Minimum Length</Label>
                  <Input
                    id="passMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => { setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)}); onChanged(); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passRotation">Rotation Period (days)</Label>
                  <Input
                    id="passRotation"
                    type="number"
                    value={securitySettings.passwordRotationDays}
                    onChange={(e) => { setSecuritySettings({...securitySettings, passwordRotationDays: parseInt(e.target.value)}); onChanged(); }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded bg-white">
                <div>
                  <p className="text-sm font-medium">Require special characters & numbers</p>
                  <p className="text-xs text-muted-foreground">Enforce strong password requirements</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            {/* Device Fingerprinting */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Device Fingerprinting</p>
                  <p className="text-xs text-muted-foreground">Track and verify login devices</p>
                </div>
              </div>
              <Switch
                checked={securitySettings.deviceFingerprint}
                onCheckedChange={(v) => { setSecuritySettings({...securitySettings, deviceFingerprint: v}); onChanged(); }}
              />
            </div>

            {/* Admin Activity Alerts */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <Label>Suspicious Activity Alerts</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Alert on failed login (3+ attempts)</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Alert on login from new location</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Alert on bulk data export</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* Encryption */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-green-700" />
                <p className="text-sm font-semibold text-green-900">Encryption Status</p>
              </div>
              <div className="space-y-1 text-sm text-green-800">
                <p>✓ Database encryption: Active (AES-256)</p>
                <p>✓ Backup encryption: Enabled</p>
                <p>✓ API key rotation: Last rotated 45 days ago</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Key className="h-4 w-4 mr-2" />
                  Rotate Encryption Keys
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      </TabsContent>

      {/* Active Sessions */}
      <TabsContent value="sessions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Admin Sessions</CardTitle>
            <CardDescription>Monitor and manage active login sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{session.device}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{session.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{session.ip}</code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{session.loginTime}</TableCell>
                    <TableCell className="text-sm">{session.lastActive}</TableCell>
                    <TableCell>
                      <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleForceLogout(session.id)}
                      >
                        <LogOut className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Tip:</strong> Force logout will immediately terminate the session and require re-authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Audit Logs */}
      <TabsContent value="audit" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Security Audit Logs</CardTitle>
                <CardDescription>Track all admin actions and login attempts</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Logins</SelectItem>
                    <SelectItem value="config">Config Changes</SelectItem>
                    <SelectItem value="data">Data Export</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.resource}</Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{log.ip}</code>
                    </TableCell>
                    <TableCell>
                      {log.status === 'success' ? (
                        <Badge variant="default" className="bg-green-600">Success</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Total Events (24h)</p>
                <p className="text-2xl font-bold text-blue-700">1,247</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">Successful Logins</p>
                <p className="text-2xl font-bold text-green-700">156</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">Failed Attempts</p>
                <p className="text-2xl font-bold text-red-700">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
