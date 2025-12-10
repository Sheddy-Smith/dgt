'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Database, 
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Filter
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface SystemBackupsLogsTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

interface Backup {
  id: string
  timestamp: string
  type: 'manual' | 'scheduled'
  components: string[]
  size: string
  status: 'completed' | 'in-progress' | 'failed'
  createdBy: string
  location: string
}

interface SystemLog {
  id: string
  timestamp: string
  level: 'error' | 'warning' | 'info'
  module: string
  message: string
  details?: string
}

export default function SystemBackupsLogsTab({ auditMode, onChanged, searchQuery }: SystemBackupsLogsTabProps) {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    retention: 7,
    components: ['database', 'media', 'config'],
    cloudProvider: 's3',
    encryption: true
  })

  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      timestamp: '2025-12-10 02:00:00',
      type: 'scheduled',
      components: ['Database', 'Media', 'Config'],
      size: '2.4 GB',
      status: 'completed',
      createdBy: 'System',
      location: 's3://dgt-backups/2025-12-10'
    },
    {
      id: '2',
      timestamp: '2025-12-09 14:30:00',
      type: 'manual',
      components: ['Database', 'Config'],
      size: '850 MB',
      status: 'completed',
      createdBy: 'admin@dgt.com',
      location: 's3://dgt-backups/2025-12-09-manual'
    },
    {
      id: '3',
      timestamp: '2025-12-09 02:00:00',
      type: 'scheduled',
      components: ['Database', 'Media', 'Config'],
      size: '2.3 GB',
      status: 'completed',
      createdBy: 'System',
      location: 's3://dgt-backups/2025-12-09'
    }
  ])

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      timestamp: '2025-12-10 10:45:23',
      level: 'error',
      module: 'Payment Gateway',
      message: 'Failed to process payment #12345',
      details: 'Connection timeout to Razorpay API'
    },
    {
      id: '2',
      timestamp: '2025-12-10 10:30:15',
      level: 'warning',
      module: 'OTP Service',
      message: 'High SMS delivery latency detected',
      details: 'Average delivery time: 8.5s (threshold: 5s)'
    },
    {
      id: '3',
      timestamp: '2025-12-10 10:15:00',
      level: 'info',
      module: 'Backup Service',
      message: 'Scheduled backup completed successfully',
      details: 'Size: 2.4GB, Duration: 12m 34s'
    },
    {
      id: '4',
      timestamp: '2025-12-10 09:58:42',
      level: 'error',
      module: 'Image Processing',
      message: 'Failed to generate thumbnail',
      details: 'Invalid image format for listing #67890'
    }
  ])

  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all')
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)

  const filteredLogs = logFilter === 'all' 
    ? systemLogs 
    : systemLogs.filter(log => log.level === logFilter)

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      type: 'manual',
      components: backupSettings.components.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      size: '---',
      status: 'in-progress',
      createdBy: 'admin@dgt.com',
      location: 'Generating...'
    }
    setBackups([newBackup, ...backups])
    onChanged()
  }

  const handleRestoreBackup = (backup: Backup) => {
    setSelectedBackup(backup)
    setIsRestoreDialogOpen(true)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Tabs defaultValue="backups" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="backups">
          <Database className="h-4 w-4 mr-2" />
          System Backups
        </TabsTrigger>
        <TabsTrigger value="logs">
          <FileText className="h-4 w-4 mr-2" />
          System Logs
        </TabsTrigger>
      </TabsList>

      {/* Backups */}
      <TabsContent value="backups" className="space-y-4">
        
        {/* Backup Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Configuration</CardTitle>
            <CardDescription>Configure automated backup schedule and retention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Automated Backups</p>
                <p className="text-xs text-muted-foreground">Enable scheduled backups</p>
              </div>
              <Switch
                checked={backupSettings.autoBackup}
                onCheckedChange={(v) => { setBackupSettings({...backupSettings, autoBackup: v}); onChanged(); }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Backup Frequency</Label>
                <Select value={backupSettings.frequency} onValueChange={(v) => { setBackupSettings({...backupSettings, frequency: v}); onChanged(); }}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention">Retention (backups)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={backupSettings.retention}
                  onChange={(e) => { setBackupSettings({...backupSettings, retention: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cloudProvider">Cloud Storage</Label>
                <Select value={backupSettings.cloudProvider} onValueChange={(v) => { setBackupSettings({...backupSettings, cloudProvider: v}); onChanged(); }}>
                  <SelectTrigger id="cloudProvider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Backup Components</Label>
              <div className="flex flex-wrap gap-2">
                {['database', 'media', 'config'].map(component => (
                  <Badge
                    key={component}
                    variant={backupSettings.components.includes(component) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const updated = backupSettings.components.includes(component)
                        ? backupSettings.components.filter(c => c !== component)
                        : [...backupSettings.components, component]
                      setBackupSettings({...backupSettings, components: updated})
                      onChanged()
                    }}
                  >
                    {component}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Backup Encryption</p>
                <p className="text-xs text-muted-foreground">Encrypt backups with AES-256</p>
              </div>
              <Switch
                checked={backupSettings.encryption}
                onCheckedChange={(v) => { setBackupSettings({...backupSettings, encryption: v}); onChanged(); }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>View and manage system backups</CardDescription>
              </div>
              <Button onClick={handleCreateBackup}>
                <Upload className="h-4 w-4 mr-2" />
                Create Manual Backup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map(backup => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-sm">{backup.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'} className="capitalize">
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {backup.components.map(comp => (
                          <Badge key={comp} variant="outline" className="text-xs">{comp}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      {backup.status === 'completed' && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {backup.status === 'in-progress' && (
                        <Badge variant="secondary">
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          In Progress
                        </Badge>
                      )}
                      {backup.status === 'failed' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{backup.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestoreBackup(backup)}
                          disabled={backup.status !== 'completed'}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={backup.status !== 'completed'}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                  <p className="text-2xl font-bold">{backups.length}</p>
                </div>
                <HardDrive className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">7.5 GB</p>
                </div>
                <Database className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-2xl font-bold">2h ago</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* System Logs */}
      <TabsContent value="logs" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Real-time application and error logs</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={logFilter} onValueChange={(v: any) => setLogFilter(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Logs
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className={`p-4 border rounded-lg ${getLevelColor(log.level)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">{log.level.toUpperCase()}</Badge>
                      <Badge variant="outline" className="text-xs">{log.module}</Badge>
                      <span className="text-xs font-mono text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground font-mono">{log.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center p-4 border-t">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Load More Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Log Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors (24h)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {systemLogs.filter(l => l.level === 'error').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings (24h)</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {systemLogs.filter(l => l.level === 'warning').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{systemLogs.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Restore Backup Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this backup? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="py-4 space-y-3">
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="text-sm"><strong>Timestamp:</strong> {selectedBackup.timestamp}</p>
                <p className="text-sm"><strong>Components:</strong> {selectedBackup.components.join(', ')}</p>
                <p className="text-sm"><strong>Size:</strong> {selectedBackup.size}</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> System will restart after restoration. All current data will be replaced.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setIsRestoreDialogOpen(false); onChanged(); }}>
              Confirm Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
