'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Shield, 
  FolderTree, 
  CreditCard, 
  Scale, 
  Flag, 
  Lock, 
  Database,
  Search,
  Save,
  RotateCcw,
  Eye
} from 'lucide-react'
import GeneralSettingsTab from '@/components/settings/general-settings-tab'
import RolesPermissionsTab from '@/components/settings/roles-permissions-tab'
import CategoriesAttributesTab from '@/components/settings/categories-attributes-tab'
import KycOtpPaymentTab from '@/components/settings/kyc-otp-payment-tab'
import TaxLegalComplianceTab from '@/components/settings/tax-legal-compliance-tab'
import FeatureFlagsTab from '@/components/settings/feature-flags-tab'
import SecurityAccessTab from '@/components/settings/security-access-tab'
import SystemBackupsLogsTab from '@/components/settings/system-backups-logs-tab'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [auditMode, setAuditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSave = () => {
    // Save all pending changes
    setHasUnsavedChanges(false)
  }

  const handleRevert = () => {
    // Revert all changes
    setHasUnsavedChanges(false)
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings & Configuration</h1>
            <p className="text-muted-foreground mt-1">
              System Control • Roles • Integrations • Policies • Feature Flags
            </p>
          </div>
          <Badge variant={process.env.NODE_ENV === 'production' ? 'destructive' : 'default'} className="px-3 py-1">
            {process.env.NODE_ENV === 'production' ? '🔴 Production' : '🔵 Staging'}
          </Badge>
        </div>

        {/* Top Bar Controls */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search settings, keys, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button
            variant={auditMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAuditMode(!auditMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Audit Mode
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevert}
              disabled={!hasUnsavedChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 h-auto">
            <TabsTrigger value="general" className="flex flex-col gap-1 py-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">General</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex flex-col gap-1 py-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Roles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex flex-col gap-1 py-3">
              <FolderTree className="h-4 w-4" />
              <span className="text-xs">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex flex-col gap-1 py-3">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">KYC/OTP/Payment</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex flex-col gap-1 py-3">
              <Scale className="h-4 w-4" />
              <span className="text-xs">Tax & Legal</span>
            </TabsTrigger>
            <TabsTrigger value="flags" className="flex flex-col gap-1 py-3">
              <Flag className="h-4 w-4" />
              <span className="text-xs">Feature Flags</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col gap-1 py-3">
              <Lock className="h-4 w-4" />
              <span className="text-xs">Security</span>
            </TabsTrigger>
            <TabsTrigger value="backups" className="flex flex-col gap-1 py-3">
              <Database className="h-4 w-4" />
              <span className="text-xs">Backups & Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralSettingsTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RolesPermissionsTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesAttributesTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <KycOtpPaymentTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <TaxLegalComplianceTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="flags" className="space-y-4">
            <FeatureFlagsTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecurityAccessTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="backups" className="space-y-4">
            <SystemBackupsLogsTab 
              auditMode={auditMode} 
              onChanged={() => setHasUnsavedChanges(true)}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
