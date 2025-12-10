'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Trash2, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface AudiencesTabProps {
  searchQuery: string
}

interface Segment {
  id: string
  name: string
  description: string
  rules: {
    role?: string[]
    tenure?: string
    cities?: string[]
    categories?: string[]
    kycStatus?: string
    activityStatus?: string
    riskScore?: string
    language?: string[]
  }
  size: number
  overlap?: string[]
  owner: string
  createdAt: string
  lastUsed: string
}

export function AudiencesTab({ searchQuery }: AudiencesTabProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [estimatedSize, setEstimatedSize] = useState(0)

  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    rules: {
      role: [] as string[],
      tenure: '',
      cities: [] as string[],
      categories: [] as string[],
      kycStatus: '',
      activityStatus: '',
      riskScore: '',
      language: [] as string[]
    }
  })

  const segments: Segment[] = [
    {
      id: '1',
      name: 'New Users (< 7 days)',
      description: 'Users who registered in the last 7 days',
      rules: { tenure: '<7d' },
      size: 3420,
      owner: 'marketing@dgt.com',
      createdAt: '2025-12-01',
      lastUsed: '2025-12-10'
    },
    {
      id: '2',
      name: 'Power Sellers',
      description: 'Verified sellers with 10+ active listings',
      rules: { role: ['seller'], kycStatus: 'verified' },
      size: 892,
      owner: 'marketing@dgt.com',
      createdAt: '2025-11-15',
      lastUsed: '2025-12-09'
    },
    {
      id: '3',
      name: 'Expiring Listings - Delhi Mobiles',
      description: 'Sellers with listings expiring in 3 days in Delhi mobile category',
      rules: { role: ['seller'], cities: ['Delhi'], categories: ['Mobiles'] },
      size: 1247,
      overlap: ['Power Sellers'],
      owner: 'marketing@dgt.com',
      createdAt: '2025-12-05',
      lastUsed: '2025-12-10'
    },
    {
      id: '4',
      name: 'At Risk - Inactive 14d',
      description: 'Users who haven\'t logged in for 14 days',
      rules: { activityStatus: 'inactive-14d' },
      size: 5634,
      owner: 'retention@dgt.com',
      createdAt: '2025-11-20',
      lastUsed: '2025-12-08'
    },
    {
      id: '5',
      name: 'High-Value Buyers',
      description: 'Buyers with lifetime transaction value > ₹50,000',
      rules: { role: ['buyer'] },
      size: 421,
      owner: 'marketing@dgt.com',
      createdAt: '2025-11-10',
      lastUsed: '2025-12-07'
    },
    {
      id: '6',
      name: 'KYC Pending',
      description: 'Sellers who haven\'t completed KYC verification',
      rules: { role: ['seller'], kycStatus: 'pending' },
      size: 2156,
      owner: 'compliance@dgt.com',
      createdAt: '2025-12-01',
      lastUsed: '2025-12-09'
    },
    {
      id: '7',
      name: 'High Risk Users',
      description: 'Users with risk score > 70',
      rules: { riskScore: '>70' },
      size: 187,
      owner: 'safety@dgt.com',
      createdAt: '2025-11-25',
      lastUsed: '2025-12-09'
    },
    {
      id: '8',
      name: 'Hindi Speakers - North India',
      description: 'Users with Hindi language preference in North India',
      rules: { language: ['hi'], cities: ['Delhi', 'Jaipur', 'Lucknow'] },
      size: 8945,
      owner: 'marketing@dgt.com',
      createdAt: '2025-11-18',
      lastUsed: '2025-12-10'
    }
  ]

  const filteredSegments = segments.filter(segment => {
    if (searchQuery && !segment.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !segment.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const calculateEstimate = (rules: typeof newSegment.rules) => {
    // Mock calculation based on rules
    let base = 50000
    if (rules.role.length > 0) base *= 0.5
    if (rules.tenure) base *= 0.3
    if (rules.cities.length > 0) base *= (rules.cities.length / 10)
    if (rules.kycStatus) base *= 0.6
    if (rules.activityStatus) base *= 0.4
    setEstimatedSize(Math.floor(base))
  }

  const toggleArrayValue = (field: string, value: string) => {
    setNewSegment(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [field]: (prev.rules[field as keyof typeof prev.rules] as string[]).includes(value)
          ? (prev.rules[field as keyof typeof prev.rules] as string[]).filter(v => v !== value)
          : [...(prev.rules[field as keyof typeof prev.rules] as string[]), value]
      }
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Audience Segments</h3>
          <p className="text-sm text-muted-foreground">Create and manage user segments for targeted campaigns</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      {segment.overlap && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {segment.overlap.length} overlap(s)
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {segment.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{segment.size.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{segment.owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{segment.createdAt}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{segment.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedSegment(segment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Segment Details: {segment.name}</DialogTitle>
                            <DialogDescription>{segment.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Estimated Size</div>
                                  <div className="text-2xl font-bold">{segment.size.toLocaleString()}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">Last Used</div>
                                  <div className="text-lg font-semibold">{segment.lastUsed}</div>
                                </CardContent>
                              </Card>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                              <h4 className="font-semibold">Segment Rules</h4>
                              {segment.rules.role && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">User Role:</span>
                                  <div className="flex gap-1">
                                    {segment.rules.role.map(r => (
                                      <Badge key={r}>{r}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {segment.rules.tenure && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Tenure:</span>
                                  <Badge>{segment.rules.tenure}</Badge>
                                </div>
                              )}
                              {segment.rules.cities && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Cities:</span>
                                  <div className="flex gap-1">
                                    {segment.rules.cities.map(c => (
                                      <Badge key={c} variant="outline">{c}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {segment.rules.categories && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Categories:</span>
                                  <div className="flex gap-1">
                                    {segment.rules.categories.map(c => (
                                      <Badge key={c} variant="outline">{c}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {segment.rules.kycStatus && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">KYC Status:</span>
                                  <Badge>{segment.rules.kycStatus}</Badge>
                                </div>
                              )}
                              {segment.rules.activityStatus && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Activity:</span>
                                  <Badge>{segment.rules.activityStatus}</Badge>
                                </div>
                              )}
                            </div>

                            {segment.overlap && (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Overlaps with: {segment.overlap.join(', ')}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Segment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Audience Segment</DialogTitle>
            <DialogDescription>Define rules to target specific user groups</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Segment Name *</Label>
              <Input
                placeholder="e.g., Active Sellers - Mumbai Electronics"
                value={newSegment.name}
                onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of this segment"
                value={newSegment.description}
                onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Separator />

            <h4 className="font-semibold">Segment Rules</h4>

            <div className="space-y-2">
              <Label>User Role</Label>
              <div className="flex gap-2">
                {['buyer', 'seller', 'both'].map(role => (
                  <Badge
                    key={role}
                    variant={newSegment.rules.role.includes(role) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('role', role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tenure (User Age)</Label>
              <Select
                value={newSegment.rules.tenure}
                onValueChange={(value) => {
                  setNewSegment(prev => ({ ...prev, rules: { ...prev.rules, tenure: value } }))
                  calculateEstimate({ ...newSegment.rules, tenure: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<7d">Less than 7 days</SelectItem>
                  <SelectItem value="7-30d">7-30 days</SelectItem>
                  <SelectItem value="30-90d">30-90 days</SelectItem>
                  <SelectItem value=">90d">More than 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cities</Label>
              <div className="flex flex-wrap gap-2">
                {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'].map(city => (
                  <Badge
                    key={city}
                    variant={newSegment.rules.cities.includes(city) ? 'default' : 'outline'}
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
                {['Mobiles', 'Electronics', 'Vehicles', 'Real Estate', 'Jobs', 'Fashion'].map(cat => (
                  <Badge
                    key={cat}
                    variant={newSegment.rules.categories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue('categories', cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>KYC Status</Label>
              <Select
                value={newSegment.rules.kycStatus}
                onValueChange={(value) => {
                  setNewSegment(prev => ({ ...prev, rules: { ...prev.rules, kycStatus: value } }))
                  calculateEstimate({ ...newSegment.rules, kycStatus: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select KYC status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Activity Status</Label>
              <Select
                value={newSegment.rules.activityStatus}
                onValueChange={(value) => {
                  setNewSegment(prev => ({ ...prev, rules: { ...prev.rules, activityStatus: value } }))
                  calculateEstimate({ ...newSegment.rules, activityStatus: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (logged in 7d)</SelectItem>
                  <SelectItem value="inactive-14d">Inactive 14 days</SelectItem>
                  <SelectItem value="inactive-30d">Inactive 30 days</SelectItem>
                  <SelectItem value="churn-risk">Churn Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language Preference</Label>
              <div className="flex flex-wrap gap-2">
                {['en', 'hi', 'mr', 'ta', 'te'].map(lang => {
                  const labels: Record<string, string> = { en: 'English', hi: 'Hindi', mr: 'Marathi', ta: 'Tamil', te: 'Telugu' }
                  return (
                    <Badge
                      key={lang}
                      variant={newSegment.rules.language.includes(lang) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayValue('language', lang)}
                    >
                      {labels[lang]}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Estimated audience size: <strong>~{estimatedSize.toLocaleString()} users</strong>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => calculateEstimate(newSegment.rules)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Creating segment:', newSegment)
              setShowCreateDialog(false)
            }}>
              Create Segment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Segments</p>
                <p className="text-2xl font-bold">{segments.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users Covered</p>
                <p className="text-2xl font-bold">{segments.reduce((sum, s) => sum + s.size, 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Segments with Overlap</p>
                <p className="text-2xl font-bold">{segments.filter(s => s.overlap).length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
