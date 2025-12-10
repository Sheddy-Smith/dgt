'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Copy, Trash2, Eye, CheckCircle, Clock, AlertCircle, FileText, History } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TemplatesTabProps {
  searchQuery: string
}

interface Template {
  id: string
  key: string
  name: string
  type: 'transactional' | 'marketing' | 'safety' | 'legal'
  channel: string
  title: string
  body: string
  cta?: string
  variables: string[]
  languages: string[]
  version: number
  status: 'draft' | 'reviewed' | 'approved'
  lastModified: string
  modifiedBy: string
}

export function TemplatesTab({ searchQuery }: TemplatesTabProps) {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedChannel, setSelectedChannel] = useState<string>('all')
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const templates: Template[] = [
    {
      id: '1',
      key: 'otp_send',
      name: 'OTP Verification',
      type: 'transactional',
      channel: 'sms',
      title: 'Your OTP',
      body: 'Your OTP for DGT is {{otp}}. Valid for {{validity}} minutes. Do not share with anyone.',
      variables: ['otp', 'validity'],
      languages: ['en', 'hi'],
      version: 3,
      status: 'approved',
      lastModified: '2025-12-08',
      modifiedBy: 'admin@dgt.com'
    },
    {
      id: '2',
      key: 'listing_approved',
      name: 'Listing Approved',
      type: 'transactional',
      channel: 'push',
      title: 'Your listing is live! 🎉',
      body: 'Great news! Your listing "{{listing_title}}" has been approved and is now live on DGT.',
      cta: 'View Listing',
      variables: ['listing_title', 'listing_id'],
      languages: ['en', 'hi', 'mr'],
      version: 2,
      status: 'approved',
      lastModified: '2025-12-05',
      modifiedBy: 'admin@dgt.com'
    },
    {
      id: '3',
      key: 'listing_rejected',
      name: 'Listing Rejected',
      type: 'transactional',
      channel: 'push',
      title: 'Action needed on your listing',
      body: 'Your listing "{{listing_title}}" needs some changes. Reason: {{rejection_reason}}. Please update and resubmit.',
      cta: 'Fix & Resubmit',
      variables: ['listing_title', 'listing_id', 'rejection_reason'],
      languages: ['en', 'hi'],
      version: 4,
      status: 'approved',
      lastModified: '2025-12-07',
      modifiedBy: 'support@dgt.com'
    },
    {
      id: '4',
      key: 'listing_expiring_3d',
      name: 'Listing Expiring (3 days)',
      type: 'marketing',
      channel: 'push',
      title: 'Your listing expires in 3 days!',
      body: 'Don\'t let "{{listing_title}}" disappear. Renew now and get 20% off on boost plans!',
      cta: 'Renew Now',
      variables: ['listing_title', 'listing_id', 'expiry_date'],
      languages: ['en', 'hi', 'mr'],
      version: 5,
      status: 'approved',
      lastModified: '2025-12-09',
      modifiedBy: 'marketing@dgt.com'
    },
    {
      id: '5',
      key: 'payout_success',
      name: 'Payout Successful',
      type: 'transactional',
      channel: 'email',
      title: 'Payout of ₹{{amount}} successful',
      body: 'Your payout request of ₹{{amount}} has been processed successfully. The amount will be credited to your account ending in {{account_last4}} within 2-3 business days. Transaction ID: {{txn_id}}',
      variables: ['amount', 'account_last4', 'txn_id', 'timestamp'],
      languages: ['en'],
      version: 1,
      status: 'approved',
      lastModified: '2025-12-01',
      modifiedBy: 'finance@dgt.com'
    },
    {
      id: '6',
      key: 'safety_tip_new_seller',
      name: 'Safety Tips for New Sellers',
      type: 'safety',
      channel: 'in-app',
      title: 'Stay safe while selling on DGT',
      body: '🛡️ Safety Tips: 1) Meet in public places 2) Verify buyer identity 3) Accept secure payments 4) Report suspicious activity. Your safety is our priority!',
      cta: 'Learn More',
      variables: ['user_name'],
      languages: ['en', 'hi', 'mr'],
      version: 1,
      status: 'reviewed',
      lastModified: '2025-12-10',
      modifiedBy: 'safety@dgt.com'
    },
    {
      id: '7',
      key: 'kyc_rejected',
      name: 'KYC Verification Failed',
      type: 'transactional',
      channel: 'push',
      title: 'KYC verification needs attention',
      body: 'We couldn\'t verify your KYC documents. Reason: {{rejection_reason}}. Please upload clear documents to continue selling.',
      cta: 'Re-upload Documents',
      variables: ['rejection_reason', 'user_name'],
      languages: ['en', 'hi'],
      version: 2,
      status: 'approved',
      lastModified: '2025-12-06',
      modifiedBy: 'kyc@dgt.com'
    },
    {
      id: '8',
      key: 'terms_update',
      name: 'Terms & Conditions Update',
      type: 'legal',
      channel: 'email',
      title: 'Important: Updated Terms & Conditions',
      body: 'We\'ve updated our Terms & Conditions effective {{effective_date}}. Please review the changes at {{terms_link}}. Continuing to use DGT means you accept the updated terms.',
      variables: ['effective_date', 'terms_link', 'user_name'],
      languages: ['en'],
      version: 1,
      status: 'draft',
      lastModified: '2025-12-10',
      modifiedBy: 'legal@dgt.com'
    }
  ]

  const getTypeBadge = (type: Template['type']) => {
    const colors = {
      transactional: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      marketing: 'bg-green-500/10 text-green-700 dark:text-green-400',
      safety: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
      legal: 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
    }
    return (
      <Badge variant="outline" className={colors[type]}>
        {type}
      </Badge>
    )
  }

  const getStatusBadge = (status: Template['status']) => {
    const variants = {
      draft: { variant: 'secondary', icon: Edit },
      reviewed: { variant: 'default', icon: Clock },
      approved: { variant: 'success', icon: CheckCircle }
    }
    const { variant, icon: Icon } = variants[status]
    return (
      <Badge variant={variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const filteredTemplates = templates.filter(template => {
    if (selectedType !== 'all' && template.type !== selectedType) return false
    if (selectedChannel !== 'all' && template.channel !== selectedChannel) return false
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.key.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const validateTemplate = (template: Template) => {
    const issues = []
    
    // Check for undefined variables
    const usedVars = (template.title + template.body).match(/{{(\w+)}}/g) || []
    const declaredVars = template.variables.map(v => `{{${v}}}`)
    const undeclared = usedVars.filter(v => !declaredVars.includes(v))
    if (undeclared.length > 0) {
      issues.push(`Undeclared variables: ${undeclared.join(', ')}`)
    }

    // SMS length check
    if (template.channel === 'sms' && template.body.length > 160) {
      issues.push(`SMS body too long (${template.body.length}/160 chars)`)
    }

    // Spam word check
    const spamWords = ['FREE', 'WINNER', 'CLICK NOW', 'LIMITED TIME']
    const hasSpam = spamWords.some(word => 
      template.title.toUpperCase().includes(word) || 
      template.body.toUpperCase().includes(word)
    )
    if (hasSpam) {
      issues.push('Contains potential spam words')
    }

    return issues
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="transactional">Transactional</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="in-app">In-App</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Reusable content library for notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Key</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{template.key}</code>
                  </TableCell>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{getTypeBadge(template.type)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.channel.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 2).map(v => (
                        <Badge key={v} variant="secondary" className="text-xs">
                          {v}
                        </Badge>
                      ))}
                      {template.variables.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {template.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">v{template.version}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{template.name}</DialogTitle>
                            <DialogDescription>
                              <code>{template.key}</code> • v{template.version} • {template.channel}
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="content">
                            <TabsList>
                              <TabsTrigger value="content">Content</TabsTrigger>
                              <TabsTrigger value="variables">Variables</TabsTrigger>
                              <TabsTrigger value="translations">Translations</TabsTrigger>
                              <TabsTrigger value="validation">Validation</TabsTrigger>
                            </TabsList>
                            <TabsContent value="content" className="space-y-4">
                              <div>
                                <Label>Title</Label>
                                <p className="mt-1 p-3 bg-muted rounded">{template.title}</p>
                              </div>
                              <div>
                                <Label>Body</Label>
                                <p className="mt-1 p-3 bg-muted rounded whitespace-pre-wrap">{template.body}</p>
                              </div>
                              {template.cta && (
                                <div>
                                  <Label>Call to Action</Label>
                                  <p className="mt-1">
                                    <Badge>{template.cta}</Badge>
                                  </p>
                                </div>
                              )}
                            </TabsContent>
                            <TabsContent value="variables" className="space-y-2">
                              <Label>Available Variables</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {template.variables.map(v => (
                                  <Card key={v}>
                                    <CardContent className="p-3">
                                      <code className="text-sm">{'{{' + v + '}}'}</code>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>
                            <TabsContent value="translations" className="space-y-4">
                              {template.languages.map(lang => (
                                <Card key={lang}>
                                  <CardHeader>
                                    <CardTitle className="text-base">{lang.toUpperCase()}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <Label className="text-xs">Title</Label>
                                      <p className="text-sm">{template.title}</p>
                                    </div>
                                    <div>
                                      <Label className="text-xs">Body</Label>
                                      <p className="text-sm">{template.body}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </TabsContent>
                            <TabsContent value="validation" className="space-y-2">
                              {validateTemplate(template).length === 0 ? (
                                <Alert>
                                  <CheckCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    Template validation passed ✓
                                  </AlertDescription>
                                </Alert>
                              ) : (
                                <Alert variant="destructive">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    <ul className="list-disc pl-4">
                                      {validateTemplate(template).map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                      ))}
                                    </ul>
                                  </AlertDescription>
                                </Alert>
                              )}
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Character count:</span>
                                  <span>{template.body.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Variable count:</span>
                                  <span>{template.variables.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Languages:</span>
                                  <span>{template.languages.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last modified:</span>
                                  <span>{template.lastModified}</span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Templates</div>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">In Review</div>
            <div className="text-2xl font-bold text-blue-600">
              {templates.filter(t => t.status === 'reviewed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Drafts</div>
            <div className="text-2xl font-bold text-gray-600">
              {templates.filter(t => t.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
