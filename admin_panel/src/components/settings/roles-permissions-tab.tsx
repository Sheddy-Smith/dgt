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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Shield, 
  Eye,
  EyeOff,
  Check,
  X,
  Users
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface RolesPermissionsTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

type PermissionLevel = 'none' | 'read' | 'write' | 'approve' | 'admin'

interface Role {
  id: string
  name: string
  description: string
  modules: Record<string, PermissionLevel>
  specialPerms: {
    canUnmaskPII: boolean
    canApprovePayout: boolean
    canEditTemplates: boolean
  }
  lastUpdated: string
  updatedBy: string
}

const MODULES = [
  'Dashboard',
  'Listings',
  'Users',
  'Wallet',
  'Ads',
  'Reports',
  'Announcements',
  'Settings'
]

export default function RolesPermissionsTab({ auditMode, onChanged, searchQuery }: RolesPermissionsTabProps) {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access',
      modules: {
        Dashboard: 'admin',
        Listings: 'admin',
        Users: 'admin',
        Wallet: 'admin',
        Ads: 'admin',
        Reports: 'admin',
        Announcements: 'admin',
        Settings: 'admin'
      },
      specialPerms: {
        canUnmaskPII: true,
        canApprovePayout: true,
        canEditTemplates: true
      },
      lastUpdated: 'Dec 1, 2025',
      updatedBy: 'System'
    },
    {
      id: '2',
      name: 'Moderator',
      description: 'Content moderation and user management',
      modules: {
        Dashboard: 'read',
        Listings: 'approve',
        Users: 'write',
        Wallet: 'read',
        Ads: 'write',
        Reports: 'write',
        Announcements: 'write',
        Settings: 'none'
      },
      specialPerms: {
        canUnmaskPII: false,
        canApprovePayout: false,
        canEditTemplates: false
      },
      lastUpdated: 'Nov 28, 2025',
      updatedBy: 'Admin'
    },
    {
      id: '3',
      name: 'Finance',
      description: 'Financial operations and payouts',
      modules: {
        Dashboard: 'read',
        Listings: 'read',
        Users: 'read',
        Wallet: 'admin',
        Ads: 'read',
        Reports: 'write',
        Announcements: 'none',
        Settings: 'read'
      },
      specialPerms: {
        canUnmaskPII: false,
        canApprovePayout: true,
        canEditTemplates: false
      },
      lastUpdated: 'Nov 25, 2025',
      updatedBy: 'Admin'
    }
  ])

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getPermissionColor = (level: PermissionLevel) => {
    switch (level) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'approve': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'write': return 'bg-green-100 text-green-800 border-green-200'
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'none': return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleRoleClick = (role: Role) => {
    setSelectedRole(role)
    setIsDetailDrawerOpen(true)
  }

  const handleCloneRole = (role: Role) => {
    const newRole = {
      ...role,
      id: Date.now().toString(),
      name: `${role.name} (Copy)`,
      lastUpdated: new Date().toLocaleDateString(),
      updatedBy: 'Current Admin'
    }
    setRoles([...roles, newRole])
    onChanged()
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId))
    onChanged()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Roles & Permissions Management</CardTitle>
              <CardDescription>Configure role-based access control (RBAC) for your team</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define permissions for a new admin role</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input id="roleName" placeholder="e.g., Content Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roleDesc">Description</Label>
                    <Textarea id="roleDesc" placeholder="Brief description of this role's responsibilities" />
                  </div>
                  <div className="space-y-2">
                    <Label>Module Permissions</Label>
                    <div className="border rounded-lg p-4 space-y-3">
                      {MODULES.map(module => (
                        <div key={module} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{module}</span>
                          <div className="flex gap-2">
                            {['none', 'read', 'write', 'approve', 'admin'].map(level => (
                              <Badge
                                key={level}
                                variant="outline"
                                className={`cursor-pointer capitalize ${getPermissionColor(level as PermissionLevel)}`}
                              >
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setIsAddDialogOpen(false); onChanged(); }}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Key Modules</TableHead>
                {auditMode && <TableHead>Last Updated</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id} className="cursor-pointer" onClick={() => handleRoleClick(role)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{role.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(role.modules)
                        .filter(([_, level]) => level !== 'none')
                        .slice(0, 3)
                        .map(([module, level]) => (
                          <Badge key={module} variant="outline" className={getPermissionColor(level)}>
                            {module}
                          </Badge>
                        ))}
                      {Object.values(role.modules).filter(l => l !== 'none').length > 3 && (
                        <Badge variant="outline">+{Object.values(role.modules).filter(l => l !== 'none').length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  {auditMode && (
                    <TableCell className="text-sm text-muted-foreground">
                      {role.lastUpdated} by {role.updatedBy}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRoleClick(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloneRole(role)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {role.name !== 'Super Admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Detail Drawer */}
      <Sheet open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          {selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {selectedRole.name}
                </SheetTitle>
                <SheetDescription>{selectedRole.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Module Permissions */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Module Permissions</h3>
                  <div className="space-y-2">
                    {MODULES.map(module => (
                      <div key={module} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm font-medium">{module}</span>
                        <div className="flex gap-1">
                          {['none', 'read', 'write', 'approve', 'admin'].map(level => {
                            const isActive = selectedRole.modules[module] === level
                            return (
                              <Badge
                                key={level}
                                variant={isActive ? 'default' : 'outline'}
                                className={`cursor-pointer capitalize text-xs ${isActive ? getPermissionColor(level as PermissionLevel) : 'opacity-50'}`}
                                onClick={() => {
                                  const updated = { ...selectedRole }
                                  updated.modules[module] = level as PermissionLevel
                                  setSelectedRole(updated)
                                  onChanged()
                                }}
                              >
                                {level}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Permissions */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Special Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Can Unmask PII</p>
                        <p className="text-xs text-muted-foreground">View personally identifiable information</p>
                      </div>
                      <Switch
                        checked={selectedRole.specialPerms.canUnmaskPII}
                        onCheckedChange={(checked) => {
                          const updated = { ...selectedRole }
                          updated.specialPerms.canUnmaskPII = checked
                          setSelectedRole(updated)
                          onChanged()
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Can Approve Payout</p>
                        <p className="text-xs text-muted-foreground">Authorize financial transactions</p>
                      </div>
                      <Switch
                        checked={selectedRole.specialPerms.canApprovePayout}
                        onCheckedChange={(checked) => {
                          const updated = { ...selectedRole }
                          updated.specialPerms.canApprovePayout = checked
                          setSelectedRole(updated)
                          onChanged()
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Can Edit Templates</p>
                        <p className="text-xs text-muted-foreground">Modify email/SMS templates</p>
                      </div>
                      <Switch
                        checked={selectedRole.specialPerms.canEditTemplates}
                        onCheckedChange={(checked) => {
                          const updated = { ...selectedRole }
                          updated.specialPerms.canEditTemplates = checked
                          setSelectedRole(updated)
                          onChanged()
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Audit Info */}
                {auditMode && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Audit Trail</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Last Updated:</span> {selectedRole.lastUpdated}</p>
                      <p><span className="text-muted-foreground">Updated By:</span> {selectedRole.updatedBy}</p>
                      <p><span className="text-muted-foreground">IP Address:</span> 192.168.1.100</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1" onClick={() => setIsDetailDrawerOpen(false)}>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => handleCloneRole(selectedRole)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Role
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
