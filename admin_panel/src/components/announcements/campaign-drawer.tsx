'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Edit, Copy, Archive, TrendingUp, Users, Eye, MousePointerClick, Mail, Bell, MessageSquare, Smartphone } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  goal: string
  channels: string[]
  audience: string
  startDate: string
  endDate: string
  sent: number
  openRate: number
  clickRate: number
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed'
}

interface CampaignDrawerProps {
  campaign: Campaign
  open: boolean
  onClose: () => void
}

export function CampaignDrawer({ campaign, open, onClose }: CampaignDrawerProps) {
  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      push: Bell,
      sms: MessageSquare,
      email: Mail,
      'in-app': Smartphone
    }
    const Icon = icons[channel]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const metrics = [
    { label: 'Sent', value: campaign.sent.toLocaleString(), icon: Users, color: 'text-blue-500' },
    { label: 'Delivered', value: `${Math.floor(campaign.sent * 0.95).toLocaleString()}`, icon: Eye, color: 'text-green-500' },
    { label: 'Opened', value: `${campaign.openRate}%`, icon: Eye, color: 'text-purple-500' },
    { label: 'Clicked', value: `${campaign.clickRate}%`, icon: MousePointerClick, color: 'text-orange-500' },
    { label: 'Conversions', value: `${Math.floor(campaign.sent * campaign.clickRate / 100 * 0.3)}`, icon: TrendingUp, color: 'text-emerald-500' }
  ]

  const contentPreview = {
    title: 'Your listing expires in 3 days!',
    body: 'Don\'t let your ad disappear. Renew now and get 20% off on boost plans to reach more buyers!',
    cta: 'Renew Now',
    link: '/renew'
  }

  const targeting = {
    segments: ['Expiring in 3 days', 'Active Sellers'],
    cities: ['Delhi'],
    categories: ['Mobiles'],
    roles: ['Sellers'],
    languages: ['English', 'Hindi']
  }

  const performance = {
    byChannel: [
      { channel: 'push', sent: 1000, delivered: 950, opened: 680, clicked: 245 },
      { channel: 'in-app', sent: 247, delivered: 247, opened: 170, clicked: 58 }
    ],
    byCity: [
      { city: 'Delhi NCR', sent: 850, opened: 581, clicked: 207 },
      { city: 'Noida', sent: 397, opened: 269, clicked: 96 }
    ]
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{campaign.name}</span>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status}
            </Badge>
          </SheetTitle>
          <SheetDescription className="capitalize">{campaign.goal}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            {campaign.status === 'active' && (
              <Button size="sm">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button size="sm">
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              {/* Overview Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <Card key={metric.label}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                            <p className="text-2xl font-bold">{metric.value}</p>
                          </div>
                          <Icon className={`h-8 w-8 ${metric.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Performance by Channel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance by Channel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {performance.byChannel.map((data) => (
                    <div key={data.channel} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(data.channel)}
                          <span className="font-medium capitalize">{data.channel}</span>
                        </div>
                        <span className="text-muted-foreground">{data.sent} sent</span>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Delivered: {data.delivered}</span>
                        <span>Opened: {data.opened}</span>
                        <span>Clicked: {data.clicked}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(data.clicked / data.sent) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance by City */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance by City</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {performance.byCity.map((data) => (
                    <div key={data.city} className="flex items-center justify-between">
                      <span className="font-medium">{data.city}</span>
                      <div className="text-sm text-muted-foreground">
                        {data.sent} sent • {((data.clicked / data.sent) * 100).toFixed(1)}% CTR
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Content Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Message Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="font-semibold">{contentPreview.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Body</p>
                    <p className="text-sm">{contentPreview.body}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Call to Action</p>
                    <div className="flex items-center gap-2">
                      <Badge>{contentPreview.cta}</Badge>
                      <span className="text-sm text-muted-foreground">{contentPreview.link}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {campaign.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="flex items-center gap-1">
                        {getChannelIcon(channel)}
                        {channel.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Localization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {targeting.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              {/* Audience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audience Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {targeting.segments.map((segment) => (
                      <Badge key={segment} variant="outline">{segment}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geography */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {targeting.cities.map((city) => (
                      <Badge key={city}>{city}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {targeting.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Roles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {targeting.roles.map((role) => (
                      <Badge key={role} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">{campaign.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">{campaign.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quiet Hours:</span>
                    <span className="font-medium">22:00 - 08:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frequency Cap:</span>
                    <span className="font-medium">3/day max</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
