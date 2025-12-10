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
  Plus, 
  Edit, 
  Trash2, 
  GripVertical,
  FolderTree,
  FileText,
  Eye,
  Copy,
  Merge
} from 'lucide-react'

interface CategoriesAttributesTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

interface Attribute {
  id: string
  name: string
  type: 'text' | 'dropdown' | 'range' | 'date' | 'boolean'
  required: boolean
  validation?: string
  options?: string[]
  defaultValue?: string
}

interface Category {
  id: string
  name: string
  slug: string
  parent?: string
  icon: string
  description: string
  listingsCount: number
  attributes: Attribute[]
  status: 'active' | 'disabled'
  autoApprove: boolean
  defaultExpiry: number
}

const ATTRIBUTE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'range', label: 'Range' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Yes/No' }
]

export default function CategoriesAttributesTab({ auditMode, onChanged, searchQuery }: CategoriesAttributesTabProps) {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      icon: '📱',
      description: 'Electronic devices and gadgets',
      listingsCount: 1250,
      attributes: [
        { id: 'a1', name: 'Brand', type: 'dropdown', required: true, options: ['Apple', 'Samsung', 'OnePlus'] },
        { id: 'a2', name: 'Condition', type: 'dropdown', required: true, options: ['New', 'Like New', 'Good', 'Fair'] },
        { id: 'a3', name: 'Warranty', type: 'boolean', required: false }
      ],
      status: 'active',
      autoApprove: false,
      defaultExpiry: 30
    },
    {
      id: '2',
      name: 'Mobiles',
      slug: 'mobiles',
      parent: 'Electronics',
      icon: '📱',
      description: 'Mobile phones and accessories',
      listingsCount: 850,
      attributes: [
        { id: 'a4', name: 'RAM', type: 'dropdown', required: true, options: ['4GB', '6GB', '8GB', '12GB'] },
        { id: 'a5', name: 'Storage', type: 'dropdown', required: true, options: ['64GB', '128GB', '256GB', '512GB'] }
      ],
      status: 'active',
      autoApprove: false,
      defaultExpiry: 30
    },
    {
      id: '3',
      name: 'Vehicles',
      slug: 'vehicles',
      icon: '🚗',
      description: 'Cars, bikes, and other vehicles',
      listingsCount: 620,
      attributes: [
        { id: 'a6', name: 'Year', type: 'range', required: true },
        { id: 'a7', name: 'Fuel Type', type: 'dropdown', required: true, options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
        { id: 'a8', name: 'KM Driven', type: 'text', required: true }
      ],
      status: 'active',
      autoApprove: true,
      defaultExpiry: 45
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId))
    onChanged()
  }

  const CategoryFormDialog = ({ isOpen, onClose, category }: { isOpen: boolean, onClose: () => void, category?: Category | null }) => {
    const [formData, setFormData] = useState<Partial<Category>>(category || {
      name: '',
      slug: '',
      icon: '',
      description: '',
      status: 'active',
      autoApprove: false,
      defaultExpiry: 30,
      attributes: []
    })

    const [currentAttribute, setCurrentAttribute] = useState<Partial<Attribute>>({
      name: '',
      type: 'text',
      required: false
    })

    const handleAddAttribute = () => {
      if (currentAttribute.name && currentAttribute.type) {
        const newAttr: Attribute = {
          id: Date.now().toString(),
          name: currentAttribute.name,
          type: currentAttribute.type as any,
          required: currentAttribute.required || false,
          options: currentAttribute.options
        }
        setFormData({
          ...formData,
          attributes: [...(formData.attributes || []), newAttr]
        })
        setCurrentAttribute({ name: '', type: 'text', required: false })
      }
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>Configure category settings and attributes</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catName">Category Name</Label>
                <Input
                  id="catName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., Electronics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catSlug">Slug</Label>
                <Input
                  id="catSlug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="electronics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catIcon">Icon (Emoji)</Label>
                <Input
                  id="catIcon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📱"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catParent">Parent Category</Label>
                <Select value={formData.parent} onValueChange={(v) => setFormData({ ...formData, parent: v })}>
                  <SelectTrigger id="catParent">
                    <SelectValue placeholder="None (Top Level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {categories.filter(c => !c.parent).map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catDesc">Description</Label>
              <Textarea
                id="catDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
                rows={2}
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Auto-approve Listings</p>
                  <p className="text-xs text-muted-foreground">Skip manual review</p>
                </div>
                <Switch
                  checked={formData.autoApprove}
                  onCheckedChange={(v) => setFormData({ ...formData, autoApprove: v })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Default Expiry (days)</Label>
                <Input
                  id="expiry"
                  type="number"
                  value={formData.defaultExpiry}
                  onChange={(e) => setFormData({ ...formData, defaultExpiry: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Attributes</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>

              {/* Existing Attributes */}
              {formData.attributes && formData.attributes.length > 0 && (
                <div className="border rounded-lg p-3 space-y-2">
                  {formData.attributes.map((attr, idx) => (
                    <div key={attr.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attr.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{attr.type}</Badge>
                          {attr.required && <Badge variant="outline" className="text-xs bg-red-50">Required</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = { ...formData }
                          updated.attributes?.splice(idx, 1)
                          setFormData(updated)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Attribute */}
              <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <p className="text-sm font-medium">Add New Attribute</p>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Field name"
                    value={currentAttribute.name}
                    onChange={(e) => setCurrentAttribute({ ...currentAttribute, name: e.target.value })}
                  />
                  <Select
                    value={currentAttribute.type}
                    onValueChange={(v) => setCurrentAttribute({ ...currentAttribute, type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTRIBUTE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={currentAttribute.required}
                      onCheckedChange={(v) => setCurrentAttribute({ ...currentAttribute, required: v })}
                    />
                    <Label className="text-xs">Required</Label>
                  </div>
                </div>
                {currentAttribute.type === 'dropdown' && (
                  <Input
                    placeholder="Options (comma-separated): Option1, Option2, Option3"
                    onChange={(e) => setCurrentAttribute({ ...currentAttribute, options: e.target.value.split(',').map(s => s.trim()) })}
                  />
                )}
                <Button variant="outline" size="sm" onClick={handleAddAttribute}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              </div>

              {/* Live Preview */}
              {showPreview && formData.attributes && formData.attributes.length > 0 && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <p className="text-sm font-semibold mb-3">Form Preview (Seller View)</p>
                  <div className="bg-white p-4 rounded-lg space-y-3">
                    {formData.attributes.map(attr => (
                      <div key={attr.id} className="space-y-1">
                        <Label>
                          {attr.name}
                          {attr.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {attr.type === 'text' && <Input placeholder={`Enter ${attr.name.toLowerCase()}`} />}
                        {attr.type === 'dropdown' && (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${attr.name.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attr.options?.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {attr.type === 'boolean' && (
                          <div className="flex items-center gap-2">
                            <Switch />
                            <span className="text-sm text-muted-foreground">Yes/No</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { onClose(); onChanged(); }}>
              {category ? 'Update Category' : 'Create Category'}
            </Button>
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
              <CardTitle>Categories & Attributes Management</CardTitle>
              <CardDescription>Configure marketplace categories and their listing attributes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Structure
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.parent ? (
                      <Badge variant="outline">{category.parent}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Top Level</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.listingsCount.toLocaleString()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {category.attributes.slice(0, 2).map(attr => (
                        <Badge key={attr.id} variant="outline" className="text-xs">
                          {attr.name}
                        </Badge>
                      ))}
                      {category.attributes.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{category.attributes.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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

      <CategoryFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <CategoryFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        category={selectedCategory}
      />
    </div>
  )
}
