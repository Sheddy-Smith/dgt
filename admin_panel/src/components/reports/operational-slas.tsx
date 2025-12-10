'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users, FileText, Zap, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function OperationalSLAs({ filters }: { filters: any }) {
  const kpis = [
    { title: 'Avg Moderation Time', value: '8.2h', status: 'success', target: '<12h', icon: <Clock className="h-4 w-4" /> },
    { title: 'KYC Turnaround', value: '4.5h', status: 'success', target: '<6h', icon: <CheckCircle className="h-4 w-4" /> },
    { title: 'Dispute Resolution', value: '18.3h', status: 'warning', target: '<24h', icon: <AlertCircle className="h-4 w-4" /> },
    { title: 'Refund Issue Time', value: '2.1h', status: 'success', target: '<3h', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'API Uptime', value: '99.8%', status: 'success', target: '>99.5%', icon: <Activity className="h-4 w-4" /> },
    { title: 'OTP Success Rate', value: '97.3%', status: 'success', target: '>95%', icon: <CheckCircle className="h-4 w-4" /> },
    { title: 'Message Latency', value: '0.8s', status: 'success', target: '<2s', icon: <Zap className="h-4 w-4" /> },
    { title: 'Queue Backlog', value: '234', status: 'warning', target: '<500', icon: <FileText className="h-4 w-4" /> },
  ]

  const getSLAColor = (status: string) => {
    switch(status) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'breach': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSLABadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch(status) {
      case 'success': return 'default'
      case 'warning': return 'secondary'
      case 'breach': return 'destructive'
      default: return 'outline'
    }
  }

  const slaCompliance = [
    { week: 'Week 1', moderation: 95, kyc: 98, dispute: 88, refund: 99 },
    { week: 'Week 2', moderation: 92, kyc: 96, dispute: 85, refund: 97 },
    { week: 'Week 3', moderation: 97, kyc: 99, dispute: 90, refund: 98 },
    { week: 'Week 4', moderation: 94, kyc: 97, dispute: 87, refund: 99 },
  ]

  const moderatorProductivity = [
    { name: 'Amit Kumar', actions: 234, avgTime: '7.2m', quality: 96 },
    { name: 'Priya Sharma', actions: 198, avgTime: '8.5m', quality: 94 },
    { name: 'Rahul Verma', actions: 187, avgTime: '9.1m', quality: 92 },
    { name: 'Sneha Patel', actions: 176, avgTime: '7.8m', quality: 95 },
    { name: 'Vikram Singh', actions: 165, avgTime: '10.2m', quality: 91 },
  ]

  const ticketVolumes = [
    { reason: 'Listing Approval', count: 2345, avgTime: '8.2h', status: 'success' },
    { reason: 'KYC Verification', count: 1876, avgTime: '4.5h', status: 'success' },
    { reason: 'Dispute Resolution', count: 543, avgTime: '18.3h', status: 'warning' },
    { reason: 'Refund Requests', count: 234, avgTime: '2.1h', status: 'success' },
    { reason: 'Account Issues', count: 187, avgTime: '6.7h', status: 'success' },
  ]

  const autoVsManual = {
    autoApprovals: 8234,
    manualApprovals: 2876,
    autoPercentage: 74,
    manualPercentage: 26,
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards with SLA Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className={kpi.status === 'breach' ? 'border-red-500' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${getSLAColor(kpi.status)}`} />
                <span className="text-xs text-muted-foreground">Target: {kpi.target}</span>
              </div>
              <Badge variant={getSLABadgeVariant(kpi.status)} className="mt-2">
                {kpi.status === 'success' ? '🟢 On Target' : 
                 kpi.status === 'warning' ? '🟡 Warning' : '🔴 Breached'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SLA Compliance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>📊 SLA Compliance Trend (Weekly %)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Week</th>
                  <th className="text-center py-3 px-4">Moderation</th>
                  <th className="text-center py-3 px-4">KYC</th>
                  <th className="text-center py-3 px-4">Dispute</th>
                  <th className="text-center py-3 px-4">Refund</th>
                </tr>
              </thead>
              <tbody>
                {slaCompliance.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.week}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.moderation >= 90 ? 'default' : 'destructive'}>
                        {row.moderation}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.kyc >= 90 ? 'default' : 'destructive'}>
                        {row.kyc}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.dispute >= 85 ? 'default' : 'destructive'}>
                        {row.dispute}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.refund >= 95 ? 'default' : 'destructive'}>
                        {row.refund}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moderator Productivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Moderator Productivity (Actions/Day)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moderatorProductivity.map((mod, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{mod.name}</p>
                      <p className="text-xs text-muted-foreground">Avg: {mod.avgTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">{mod.actions} actions</Badge>
                    <p className="text-xs text-green-600 mt-1">{mod.quality}% quality</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto vs Manual Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Auto vs Manual Approvals Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm text-muted-foreground mb-1">Auto Approved</p>
                  <p className="text-2xl font-bold">{autoVsManual.autoApprovals.toLocaleString()}</p>
                  <Progress value={autoVsManual.autoPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{autoVsManual.autoPercentage}%</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Manual Review</p>
                  <p className="text-2xl font-bold">{autoVsManual.manualApprovals.toLocaleString()}</p>
                  <Progress value={autoVsManual.manualPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{autoVsManual.manualPercentage}%</p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Automation Efficiency</p>
                <p className="text-xs text-muted-foreground mt-1">
                  74% auto-approval reduces manual workload by ~6,158 actions/day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Volumes by Reason */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Ticket Volumes by Reason
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ticketVolumes.map((ticket, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{ticket.reason}</p>
                  <Badge variant={getSLABadgeVariant(ticket.status)}>
                    {ticket.avgTime}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{ticket.count.toLocaleString()} tickets</span>
                  <div className={`w-2 h-2 rounded-full ${getSLAColor(ticket.status)}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Queue Backlog Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Queue Backlog Chart (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">234</p>
                <Badge variant="outline" className="mt-1">Normal</Badge>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">87</p>
                <Badge variant="default" className="mt-1">Active</Badge>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-xl font-bold">1,234</p>
                <Badge variant="default" className="bg-green-500 mt-1">Done</Badge>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-xl font-bold">4.2h</p>
                <Badge variant="outline" className="mt-1">Target: {'<'}6h</Badge>
              </div>
            </div>
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Line Chart: Hourly Queue Depth</p>
                <p className="text-xs">Shows pending vs resolved over 24h</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            System Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground mb-2">API Uptime</p>
              <p className="text-3xl font-bold">99.8%</p>
              <p className="text-xs text-green-600 mt-1">🟢 All systems operational</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">OTP Success Rate</p>
              <p className="text-3xl font-bold">97.3%</p>
              <p className="text-xs text-green-600 mt-1">🟢 Within target ({'>'}95%)</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold">0.8s</p>
              <p className="text-xs text-green-600 mt-1">🟢 Excellent ({'<'}2s target)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
