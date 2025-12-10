'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileText, 
  Scale,
  Percent,
  Shield,
  Download,
  Calendar,
  Bell,
  Plus
} from 'lucide-react'

interface TaxLegalComplianceTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

export default function TaxLegalComplianceTab({ auditMode, onChanged, searchQuery }: TaxLegalComplianceTabProps) {
  const [taxSettings, setTaxSettings] = useState({
    gstPercent: 18,
    vatPercent: 0,
    commissionPercent: 5,
    autoGstInvoice: true,
    gstin: 'XXGSTXXXXXXXX',
    pan: 'ABCDE1234F'
  })

  const [policies, setPolicies] = useState([
    { id: '1', name: 'Privacy Policy', version: '2.1', effectiveDate: '2025-01-01', status: 'active' },
    { id: '2', name: 'Refund Policy', version: '1.5', effectiveDate: '2024-12-01', status: 'active' },
    { id: '3', name: 'Terms of Service', version: '3.0', effectiveDate: '2025-01-15', status: 'draft' }
  ])

  const [complianceSettings, setComplianceSettings] = useState({
    dataRetentionDays: 180,
    gdprEnabled: true,
    exportDataOnRequest: true,
    rightToForget: true
  })

  return (
    <Tabs defaultValue="taxation" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="taxation">
          <Percent className="h-4 w-4 mr-2" />
          Taxation
        </TabsTrigger>
        <TabsTrigger value="legal">
          <FileText className="h-4 w-4 mr-2" />
          Legal Documents
        </TabsTrigger>
        <TabsTrigger value="compliance">
          <Shield className="h-4 w-4 mr-2" />
          Compliance
        </TabsTrigger>
      </TabsList>

      {/* Taxation */}
      <TabsContent value="taxation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>Manage GST, VAT, commission, and invoice settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gst">GST Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="gst"
                    type="number"
                    step="0.1"
                    value={taxSettings.gstPercent}
                    onChange={(e) => { setTaxSettings({...taxSettings, gstPercent: parseFloat(e.target.value)}); onChanged(); }}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="vat"
                    type="number"
                    step="0.1"
                    value={taxSettings.vatPercent}
                    onChange={(e) => { setTaxSettings({...taxSettings, vatPercent: parseFloat(e.target.value)}); onChanged(); }}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Platform Commission</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="commission"
                    type="number"
                    step="0.1"
                    value={taxSettings.commissionPercent}
                    onChange={(e) => { setTaxSettings({...taxSettings, commissionPercent: parseFloat(e.target.value)}); onChanged(); }}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  value={taxSettings.gstin}
                  onChange={(e) => { setTaxSettings({...taxSettings, gstin: e.target.value}); onChanged(); }}
                  placeholder="XXGSTXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  value={taxSettings.pan}
                  onChange={(e) => { setTaxSettings({...taxSettings, pan: e.target.value}); onChanged(); }}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto GST Invoice Generation</p>
                <p className="text-xs text-muted-foreground">Automatically generate invoices for transactions</p>
              </div>
              <Switch
                checked={taxSettings.autoGstInvoice}
                onCheckedChange={(v) => { setTaxSettings({...taxSettings, autoGstInvoice: v}); onChanged(); }}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-blue-900">Sample Invoice Preview</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>
              <div className="bg-white p-4 rounded border text-sm space-y-2">
                <p className="font-bold">DGT Marketplace Pvt Ltd</p>
                <p className="text-xs text-muted-foreground">GSTIN: {taxSettings.gstin} | PAN: {taxSettings.pan}</p>
                <hr className="my-2" />
                <div className="flex justify-between"><span>Subtotal:</span><span>₹1,000</span></div>
                <div className="flex justify-between"><span>Commission ({taxSettings.commissionPercent}%):</span><span>₹{(1000 * taxSettings.commissionPercent / 100).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST ({taxSettings.gstPercent}%):</span><span>₹{(1000 * taxSettings.gstPercent / 100).toFixed(2)}</span></div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold"><span>Total:</span><span>₹{(1000 + (1000 * taxSettings.commissionPercent / 100) + (1000 * taxSettings.gstPercent / 100)).toFixed(2)}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>State-Specific Tax Overrides</Label>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add State Override
              </Button>
              <p className="text-xs text-muted-foreground">Configure different tax rates for specific states or regions</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Legal Documents */}
      <TabsContent value="legal" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Legal Policy Documents</CardTitle>
                <CardDescription>Manage privacy policy, terms of service, and other legal documents</CardDescription>
              </div>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Policy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.map(policy => (
                <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{policy.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">v{policy.version}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Effective: {policy.effectiveDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border rounded-lg bg-muted/30 space-y-4">
              <p className="text-sm font-semibold">Edit Policy Template</p>
              <div className="space-y-2">
                <Label htmlFor="policyTitle">Policy Title</Label>
                <Input id="policyTitle" placeholder="e.g., Privacy Policy" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input id="effectiveDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyContent">Content</Label>
                <Textarea
                  id="policyContent"
                  placeholder="Write policy content in rich text format..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Publish Policy</Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Announce Update to Users
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Policy updates will be announced to all users. Users must acknowledge before next login.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Compliance */}
      <TabsContent value="compliance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Compliance & Privacy</CardTitle>
            <CardDescription>GDPR, DPDP, and data retention policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">GDPR/DPDP Compliance</p>
                  <p className="text-xs text-muted-foreground">Enable data protection regulations</p>
                </div>
                <Switch
                  checked={complianceSettings.gdprEnabled}
                  onCheckedChange={(v) => { setComplianceSettings({...complianceSettings, gdprEnabled: v}); onChanged(); }}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Export Data on Request</p>
                  <p className="text-xs text-muted-foreground">Allow users to download their data</p>
                </div>
                <Switch
                  checked={complianceSettings.exportDataOnRequest}
                  onCheckedChange={(v) => { setComplianceSettings({...complianceSettings, exportDataOnRequest: v}); onChanged(); }}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Right to Forget</p>
                  <p className="text-xs text-muted-foreground">Allow users to request account deletion</p>
                </div>
                <Switch
                  checked={complianceSettings.rightToForget}
                  onCheckedChange={(v) => { setComplianceSettings({...complianceSettings, rightToForget: v}); onChanged(); }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retention">Data Retention Period (days)</Label>
              <Input
                id="retention"
                type="number"
                value={complianceSettings.dataRetentionDays}
                onChange={(e) => { setComplianceSettings({...complianceSettings, dataRetentionDays: parseInt(e.target.value)}); onChanged(); }}
              />
              <p className="text-xs text-muted-foreground">
                Inactive user data will be automatically deleted after this period
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-green-900">Compliance Status</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-800">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-800">DPDP Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-800">Data Retention Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-800">Consent Logs Enabled</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audit & Export</Label>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Consent Logs
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Trail
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Compliance Report
                </Button>
              </div>
            </div>

            {auditMode && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Recent Compliance Activity</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>• 23 data export requests fulfilled (last 30 days)</p>
                  <p>• 8 account deletion requests processed</p>
                  <p>• 1,247 consent logs captured</p>
                  <p>• Last compliance audit: Dec 1, 2025</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
