'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Shield,
  Bell,
  FileText,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  onLogout: () => void
}

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/dashboard',
    badge: null
  },
  { 
    icon: Package, 
    label: 'Listings', 
    href: '/listings',
    badge: null,
    submenu: [
      { label: 'All Listings', href: '/listings' },
      { label: 'Pending Review', href: '/listings/pending', badge: 0 },
      { label: 'Reported', href: '/listings/reported', badge: 0 },
      { label: 'Boosted', href: '/listings/boosted' },
      { label: 'Expired', href: '/listings/expired' },
    ]
  },
  { 
    icon: TrendingUp, 
    label: 'Categories', 
    href: '/categories'
  },
  { 
    icon: Users, 
    label: 'Users', 
    href: '/users',
    submenu: [
      { label: 'All Users', href: '/users' },
      { label: 'KYC Queue', href: '/users/kyc', badge: 0 },
      { label: 'Power Sellers', href: '/users/power-sellers' },
      { label: 'Blocked', href: '/users/blocked' },
    ]
  },
  { 
    icon: Wallet, 
    label: 'Wallet & Payments', 
    href: '/wallet',
    submenu: [
      { label: 'User Wallets', href: '/wallet' },
      { label: 'Payout Requests', href: '/wallet/payouts', badge: 0 },
      { label: 'Refunds', href: '/wallet/refunds', badge: 0 },
      { label: 'Chargebacks', href: '/wallet/chargebacks' },
    ]
  },
  { 
    icon: BarChart3, 
    label: 'Ads, Banners & Promotions', 
    href: '/ads',
    submenu: [
      { label: 'Home Banners', href: '/ads#home-banners' },
      { label: 'Category Ads', href: '/ads#category-ads' },
      { label: 'Boost Plans', href: '/ads#boost-plans' },
      { label: 'Coupons & Offers', href: '/ads#coupons' },
      { label: 'Campaigns', href: '/ads#campaigns' },
      { label: 'Analytics', href: '/ads#analytics' },
    ]
  },
  { 
    icon: Bell, 
    label: 'Announcements', 
    href: '/announcements',
    submenu: [
      { label: 'Broadcasts', href: '/announcements/broadcasts' },
      { label: 'System Alerts', href: '/announcements/alerts' },
      { label: 'Templates', href: '/announcements/templates' },
    ]
  },
  { 
    icon: MessageSquare, 
    label: 'Messaging & Disputes', 
    href: '/disputes',
    badge: 0,
    submenu: [
      { label: 'Chat Monitor', href: '/disputes/chat' },
      { label: 'Dispute Center', href: '/disputes', badge: 0 },
      { label: 'Evidence Viewer', href: '/disputes/evidence' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Reports & Analytics', 
    href: '/reports',
    submenu: [
      { label: 'Marketplace Overview', href: '/reports#overview' },
      { label: 'User Analytics', href: '/reports#users' },
      { label: 'Listing Insights', href: '/reports#listings' },
      { label: 'Monetization', href: '/reports#monetization' },
      { label: 'Trust & Safety', href: '/reports#trust' },
      { label: 'Operational SLAs', href: '/reports#sla' },
      { label: 'Retention & Engagement', href: '/reports#retention' },
      { label: 'Custom Reports', href: '/reports#custom' },
    ]
  },
  { 
    icon: Settings, 
    label: 'Settings & Configuration', 
    href: '/settings',
    submenu: [
      { label: 'General Settings', href: '/settings#general' },
      { label: 'Roles & Permissions', href: '/settings#roles' },
      { label: 'Categories & Attributes', href: '/settings#categories' },
      { label: 'KYC/OTP/Payment', href: '/settings#kyc' },
      { label: 'Tax & Legal', href: '/settings#legal' },
      { label: 'Feature Flags', href: '/settings#flags' },
      { label: 'Security & Access', href: '/settings#security' },
      { label: 'Backups & Logs', href: '/settings#backups' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Audit Log', 
    href: '/audit'
  },
]

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Dashboard'])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DGT Admin</h1>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isExpanded = expandedMenus.includes(item.label)
          const hasSubmenu = item.submenu && item.submenu.length > 0
          
          return (
            <div key={item.href}>
              {hasSubmenu ? (
                <>
                  <button
                    onClick={() => {
                      setExpandedMenus(prev => 
                        prev.includes(item.label) 
                          ? prev.filter(m => m !== item.label)
                          : [...prev, item.label]
                      )
                    }}
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                              isSubActive 
                                ? "bg-blue-600 text-white font-medium" 
                                : "text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            <span>{subItem.label}</span>
                            {subItem.badge !== undefined && subItem.badge > 0 && (
                              <span className={cn(
                                "text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                isSubActive 
                                  ? "bg-white text-blue-600" 
                                  : "bg-red-500 text-white"
                              )}>
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  )
}
