'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Download, 
  Calendar, 
  Save, 
  Play, 
  Trash2, 
  Clock,
  FileText,
  Table2,
  FileSpreadsheet
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export function CustomReports() {
  const [savedTemplates, setSavedTemplates] = useState([
    { id: 1, name: 'Weekly Category Performance', schedule: 'Weekly', lastRun: '2h ago', owner: 'You' },
    { id: 2, name: 'Top Sellers by GMV', schedule: 'Daily', lastRun: '1d ago', owner: 'Marketing Team' },
    { id: 3, name: 'Refund Summary by City', schedule: 'Monthly', lastRun: '5d ago', owner: 'Finance Team' },
    { id: 4, name: 'Moderator Efficiency', schedule: 'Weekly', lastRun: '3d ago', owner: 'You' },
    { id: 5, name: 'Daily Payout Report', schedule: 'Daily', lastRun: '12h ago', owner: 'Finance Team' },
  ])

  const [exportLogs, setExportLogs] = useState([
    { date: '2024-12-10 09:30', user: 'Amit Kumar', report: 'Weekly Category Performance', format: 'CSV' },
    { date: '2024-12-10 08:15', user: 'Priya Sharma', report: 'Top Sellers by GMV', format: 'Excel' },
    { date: '2024-12-09 16:45', user: 'Finance Team', report: 'Refund Summary by City', format: 'PDF' },
  ])

  const availableMetrics = [
    'Total Listings',
    'Active Listings',
    'New Users',
    'Total Revenue',
    'GMV',
    'Conversion Rate',
    'Average Price',
    'Boost Sales',
    'Refund Amount',
    'Moderator Actions',
  ]

  const availableFilters = [
    'Date Range',
    'City',
    'Category',
    'Platform',
    'User Type',
    'Price Range',
  ]

  const groupByOptions = [
    'Date',
    'Category',
    'City',
    'Platform',
    'User Type',
  ]

  return (
    <div className="space-y-6">
      {/* Query Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            Custom Query Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Name */}
            <div className="space-y-2">
              <Label>Report Name</Label>
              <Input placeholder="e.g., Monthly Revenue by Category" />
            </div>

            {/* Select Metrics */}
            <div className="space-y-2">
              <Label>Select Metrics</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`metric-${index}`} />
                    <label
                      htmlFor={`metric-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {metric}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <Label>Apply Filters</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableFilters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`filter-${index}`} />
                    <label
                      htmlFor={`filter-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Group By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Group By</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupByOptions.map((option, index) => (
                      <SelectItem key={index} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Run Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save as Template
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Saved Report Templates
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.owner} · Last run: {template.lastRun}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.schedule}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Schedule Recurring Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                    <SelectItem value="monthly">Monthly (1st)</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" defaultChecked />
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="slack" />
                  <label htmlFor="slack" className="text-sm font-medium">Slack</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="download" />
                  <label htmlFor="download" className="text-sm font-medium">Auto-Download</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input placeholder="email1@example.com, email2@example.com" />
            </div>

            <Button>Save Schedule</Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-orange-500" />
            Export Logs (Who, When, Filters Used)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date & Time</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Report Name</th>
                  <th className="text-center py-3 px-4">Format</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exportLogs.map((log, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{log.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{log.user}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{log.report}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                        {log.format === 'CSV' && <FileText className="h-3 w-3" />}
                        {log.format === 'Excel' && <FileSpreadsheet className="h-3 w-3" />}
                        {log.format}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>🔒 Access Control & Data Governance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted">
              <h4 className="font-medium mb-2">Security Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Role-based view access (Finance sees only revenue)</li>
                <li>✓ Sensitive data masked by default</li>
                <li>✓ Audit trail of report exports</li>
                <li>✓ Aggregation limits (no raw PII exposure)</li>
                <li>✓ Encryption in storage & transit</li>
                <li>✓ Data retention: raw logs 90d, aggregates 2y</li>
                <li>✓ GDPR/DPDP compliant data masking</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Reports Created</p>
                <p className="text-2xl font-bold">234</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Exports This Month</p>
                <p className="text-2xl font-bold">1,876</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Scheduled Reports</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoint Info */}
      <Card>
        <CardHeader>
          <CardTitle>🔌 API Endpoint for External BI Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg font-mono text-sm">
              <p className="text-muted-foreground mb-2">Endpoint:</p>
              <code>https://api.dgt.com/v1/reports/custom</code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Authentication</p>
                <p className="text-xs text-muted-foreground">Bearer token required</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Rate Limit</p>
                <p className="text-xs text-muted-foreground">100 requests/hour</p>
              </div>
            </div>
            <Button variant="outline">View API Documentation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
