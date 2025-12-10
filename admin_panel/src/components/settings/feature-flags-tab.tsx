'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Flag, 
  Plus, 
  Edit, 
  Trash2,
  Power,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react'

interface FeatureFlagsTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

interface FeatureFlag {
  id: string
  key: string
  description: string
  status: 'active' | 'inactive' | 'scheduled'
  rolloutPercent: number
  targeting: 'all' | 'region' | 'segment' | 'role'
  targetValue?: string
  createdBy: string
  createdAt: string
  startDate?: string
  endDate?: string
  experiment?: {
    variant: string
    metrics: { ctr: number, engagement: number }
  }
}

export default function FeatureFlagsTab({ auditMode, onChanged, searchQuery }: FeatureFlagsTabProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      id: '1',
      key: 'boost_v2_enabled',
      description: 'New boost algorithm with better visibility',
      status: 'active',
      rolloutPercent: 100,
      targeting: 'all',
      createdBy: 'Admin',
      createdAt: 'Dec 1, 2025',
      experiment: { variant: 'B', metrics: { ctr: 12.5, engagement: 8.2 } }
    },
    {
      id: '2',
      key: 'new_checkout_flow',
      description: 'Simplified checkout with one-click payments',
      status: 'active',
      rolloutPercent: 50,
      targeting: 'segment',
      targetValue: 'premium_users',
      createdBy: 'Product',
      createdAt: 'Nov 28, 2025',
      experiment: { variant: 'A/B', metrics: { ctr: 18.3, engagement: 15.7 } }
    },
    {
      id: '3',
      key: 'ai_moderation_experiment',
      description: 'AI-powered content moderation system',
      status: 'scheduled',
      rolloutPercent: 10,
      targeting: 'region',
      targetValue: 'Mumbai',
      createdBy: 'Developer',
      createdAt: 'Dec 5, 2025',
      startDate: '2025-12-15',
      endDate: '2026-01-15'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null)

  const handleToggleFlag = (flagId: string) => {
    setFlags(flags.map(f => 
      f.id === flagId 
        ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } 
        : f
    ))
    onChanged()
  }

  const handleDeleteFlag = (flagId: string) => {
    setFlags(flags.filter(f => f.id !== flagId))
    onChanged()
  }

  const FlagFormDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      key: '',
      description: '',
      rolloutPercent: 0,
      targeting: 'all' as const,
      targetValue: '',
      startDate: '',
      endDate: ''
    })

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Feature Flag</DialogTitle>
            <DialogDescription>Configure a new feature flag or experiment</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flagKey">Flag Key</Label>
                <Input
                  id="flagKey"
                  placeholder="e.g., new_feature_enabled"
                  value={formData.key}
                  onChange={(e) => setFormData({...formData, key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targeting">Target Audience</Label>
                <Select value={formData.targeting} onValueChange={(v: any) => setFormData({...formData, targeting: v})}>
                  <SelectTrigger id="targeting">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="region">By Region</SelectItem>
                    <SelectItem value="segment">By Segment</SelectItem>
                    <SelectItem value="role">By Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does this feature flag control?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>

            {formData.targeting !== 'all' && (
              <div className="space-y-2">
                <Label htmlFor="targetValue">Target Value</Label>
                <Input
                  id="targetValue"
                  placeholder="e.g., Mumbai, premium_users, admin"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rollout Percentage</Label>
                <Badge variant="outline">{formData.rolloutPercent}%</Badge>
              </div>
              <Slider
                value={[formData.rolloutPercent]}
                onValueChange={(v) => setFormData({...formData, rolloutPercent: v[0]})}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Traffic exposure: {formData.rolloutPercent}% of {formData.targeting === 'all' ? 'all users' : formData.targeting}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>A/B Testing:</strong> Set rollout to 50% to run A/B experiments. Monitor metrics in real-time.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { onClose(); onChanged(); }}>Create Flag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feature Flags & Experiments</CardTitle>
              <CardDescription>Control feature rollouts and run A/B tests</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature Flag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag Key</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rollout</TableHead>
                <TableHead>Target</TableHead>
                {auditMode && <TableHead>Created</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map(flag => (
                <TableRow key={flag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-purple-600" />
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {flag.key}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm">{flag.description}</p>
                    {flag.experiment && (
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          CTR: {flag.experiment.metrics.ctr}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Eng: {flag.experiment.metrics.engagement}%
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          flag.status === 'active' ? 'default' : 
                          flag.status === 'scheduled' ? 'secondary' : 
                          'outline'
                        }
                        className="capitalize"
                      >
                        {flag.status}
                      </Badge>
                      {flag.experiment && (
                        <Badge variant="outline" className="text-xs bg-purple-50">
                          A/B Test
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${flag.rolloutPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{flag.rolloutPercent}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {flag.targeting === 'all' ? (
                      <Badge variant="outline">All Users</Badge>
                    ) : (
                      <div>
                        <Badge variant="outline" className="capitalize">{flag.targeting}</Badge>
                        {flag.targetValue && (
                          <p className="text-xs text-muted-foreground mt-1">{flag.targetValue}</p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  {auditMode && (
                    <TableCell className="text-sm text-muted-foreground">
                      {flag.createdAt}
                      <br />
                      <span className="text-xs">by {flag.createdBy}</span>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFlag(flag.id)}
                      >
                        <Power className={`h-4 w-4 ${flag.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFlag(flag.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Flags</p>
                <p className="text-2xl font-bold">{flags.filter(f => f.status === 'active').length}</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experiments</p>
                <p className="text-2xl font-bold">{flags.filter(f => f.experiment).length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{flags.filter(f => f.status === 'scheduled').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rollout</p>
                <p className="text-2xl font-bold">
                  {Math.round(flags.reduce((acc, f) => acc + f.rolloutPercent, 0) / flags.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <FlagFormDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </div>
  )
}
