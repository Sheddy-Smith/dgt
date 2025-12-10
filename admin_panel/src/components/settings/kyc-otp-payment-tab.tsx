'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Shield, 
  MessageSquare, 
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  TestTube2,
  Zap
} from 'lucide-react'

interface KycOtpPaymentTabProps {
  auditMode: boolean
  onChanged: () => void
  searchQuery: string
}

export default function KycOtpPaymentTab({ auditMode, onChanged, searchQuery }: KycOtpPaymentTabProps) {
  const [kycSettings, setKycSettings] = useState({
    provider: 'onfido',
    requiredDocs: ['pan', 'aadhaar', 'selfie'],
    autoVerify: false,
    retryLimit: 3,
    cooldownPeriod: 24,
    minAge: 18,
    apiKey: '••••••••••••••••',
    webhookUrl: 'https://api.dgt.com/kyc/webhook'
  })

  const [otpSettings, setOtpSettings] = useState({
    provider: 'twilio',
    expiryTime: 60,
    retryLimit: 3,
    rateLimitPerHour: 5,
    fallbackToEmail: true,
    apiKey: '••••••••••••••••',
    apiSecret: '••••••••••••••••'
  })

  const [paymentSettings, setPaymentSettings] = useState({
    provider: 'razorpay',
    sandboxMode: false,
    keyId: '••••••••••••••••',
    keySecret: '••••••••••••••••',
    webhookSecret: '••••••••••••••••',
    feePercentage: 2.5,
    minAmount: 100,
    maxAmount: 100000,
    retryAttempts: 3
  })

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (key: string) => {
    setShowKeys({ ...showKeys, [key]: !showKeys[key] })
  }

  return (
    <Tabs defaultValue="kyc" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="kyc">
          <Shield className="h-4 w-4 mr-2" />
          KYC Configuration
        </TabsTrigger>
        <TabsTrigger value="otp">
          <MessageSquare className="h-4 w-4 mr-2" />
          OTP Settings
        </TabsTrigger>
        <TabsTrigger value="payment">
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Gateway
        </TabsTrigger>
      </TabsList>

      {/* KYC Configuration */}
      <TabsContent value="kyc" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>KYC Configuration</CardTitle>
            <CardDescription>Configure identity verification provider and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kycProvider">KYC Provider</Label>
                <Select value={kycSettings.provider} onValueChange={(v) => { setKycSettings({...kycSettings, provider: v}); onChanged(); }}>
                  <SelectTrigger id="kycProvider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onfido">Onfido</SelectItem>
                    <SelectItem value="signzy">Signzy</SelectItem>
                    <SelectItem value="idfy">IDfy</SelectItem>
                    <SelectItem value="manual">Manual Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAge">Minimum Age</Label>
                <Input
                  id="minAge"
                  type="number"
                  value={kycSettings.minAge}
                  onChange={(e) => { setKycSettings({...kycSettings, minAge: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Documents</Label>
              <div className="flex flex-wrap gap-2">
                {['PAN', 'Aadhaar', 'Selfie', 'Address Proof'].map(doc => (
                  <Badge
                    key={doc}
                    variant={kycSettings.requiredDocs.includes(doc.toLowerCase()) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const key = doc.toLowerCase()
                      const updated = kycSettings.requiredDocs.includes(key)
                        ? kycSettings.requiredDocs.filter(d => d !== key)
                        : [...kycSettings.requiredDocs, key]
                      setKycSettings({...kycSettings, requiredDocs: updated})
                      onChanged()
                    }}
                  >
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Auto Verification</p>
                  <p className="text-xs text-muted-foreground">Skip manual review</p>
                </div>
                <Switch
                  checked={kycSettings.autoVerify}
                  onCheckedChange={(v) => { setKycSettings({...kycSettings, autoVerify: v}); onChanged(); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryLimit">Retry Limit</Label>
                <Input
                  id="retryLimit"
                  type="number"
                  value={kycSettings.retryLimit}
                  onChange={(e) => { setKycSettings({...kycSettings, retryLimit: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <p className="text-sm font-semibold">API Credentials</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="kycApiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="kycApiKey"
                      type={showKeys['kycApi'] ? 'text' : 'password'}
                      value={kycSettings.apiKey}
                      onChange={(e) => { setKycSettings({...kycSettings, apiKey: e.target.value}); onChanged(); }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility('kycApi')}
                    >
                      {showKeys['kycApi'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kycWebhook">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="kycWebhook"
                      value={kycSettings.webhookUrl}
                      onChange={(e) => { setKycSettings({...kycSettings, webhookUrl: e.target.value}); onChanged(); }}
                    />
                    <Button variant="outline" size="sm">
                      <TestTube2 className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {auditMode && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">Last updated: Dec 5, 2025 by Admin • IP: 192.168.1.100</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* OTP Settings */}
      <TabsContent value="otp" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>OTP Settings</CardTitle>
            <CardDescription>Configure SMS/Email OTP delivery and validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="otpProvider">OTP Provider</Label>
                <Select value={otpSettings.provider} onValueChange={(v) => { setOtpSettings({...otpSettings, provider: v}); onChanged(); }}>
                  <SelectTrigger id="otpProvider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="gupshup">Gupshup</SelectItem>
                    <SelectItem value="msg91">MSG91</SelectItem>
                    <SelectItem value="firebase">Firebase Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpExpiry">OTP Expiry (seconds)</Label>
                <Input
                  id="otpExpiry"
                  type="number"
                  value={otpSettings.expiryTime}
                  onChange={(e) => { setOtpSettings({...otpSettings, expiryTime: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="otpRetry">Retry Limit</Label>
                <Input
                  id="otpRetry"
                  type="number"
                  value={otpSettings.retryLimit}
                  onChange={(e) => { setOtpSettings({...otpSettings, retryLimit: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (per hour)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={otpSettings.rateLimitPerHour}
                  onChange={(e) => { setOtpSettings({...otpSettings, rateLimitPerHour: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Fallback to Email OTP</p>
                <p className="text-xs text-muted-foreground">Send email OTP if SMS fails</p>
              </div>
              <Switch
                checked={otpSettings.fallbackToEmail}
                onCheckedChange={(v) => { setOtpSettings({...otpSettings, fallbackToEmail: v}); onChanged(); }}
              />
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <p className="text-sm font-semibold">API Credentials</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="otpApiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otpApiKey"
                      type={showKeys['otpKey'] ? 'text' : 'password'}
                      value={otpSettings.apiKey}
                      onChange={(e) => { setOtpSettings({...otpSettings, apiKey: e.target.value}); onChanged(); }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility('otpKey')}
                    >
                      {showKeys['otpKey'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otpSecret">API Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otpSecret"
                      type={showKeys['otpSecret'] ? 'text' : 'password'}
                      value={otpSettings.apiSecret}
                      onChange={(e) => { setOtpSettings({...otpSettings, apiSecret: e.target.value}); onChanged(); }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility('otpSecret')}
                    >
                      {showKeys['otpSecret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Delivery Success</p>
                <p className="text-2xl font-bold text-green-700">98.5%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-green-700">2.3s</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Today's Count</p>
                <p className="text-2xl font-bold text-green-700">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Payment Gateway */}
      <TabsContent value="payment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Setup</CardTitle>
            <CardDescription>Configure payment provider for wallets, boosts, and ads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payProvider">Payment Provider</Label>
                <Select value={paymentSettings.provider} onValueChange={(v) => { setPaymentSettings({...paymentSettings, provider: v}); onChanged(); }}>
                  <SelectTrigger id="payProvider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="cashfree">Cashfree</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paytm">Paytm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feePercent">Transaction Fee (%)</Label>
                <Input
                  id="feePercent"
                  type="number"
                  step="0.1"
                  value={paymentSettings.feePercentage}
                  onChange={(e) => { setPaymentSettings({...paymentSettings, feePercentage: parseFloat(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Sandbox Mode</p>
                  <p className="text-xs text-amber-700">Test transactions without real money</p>
                </div>
              </div>
              <Switch
                checked={paymentSettings.sandboxMode}
                onCheckedChange={(v) => { setPaymentSettings({...paymentSettings, sandboxMode: v}); onChanged(); }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={paymentSettings.minAmount}
                  onChange={(e) => { setPaymentSettings({...paymentSettings, minAmount: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount (₹)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={paymentSettings.maxAmount}
                  onChange={(e) => { setPaymentSettings({...paymentSettings, maxAmount: parseInt(e.target.value)}); onChanged(); }}
                />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <p className="text-sm font-semibold">API Credentials</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="payKeyId">Key ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="payKeyId"
                        type={showKeys['payKey'] ? 'text' : 'password'}
                        value={paymentSettings.keyId}
                        onChange={(e) => { setPaymentSettings({...paymentSettings, keyId: e.target.value}); onChanged(); }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleKeyVisibility('payKey')}
                      >
                        {showKeys['payKey'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payKeySecret">Key Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        id="payKeySecret"
                        type={showKeys['paySecret'] ? 'text' : 'password'}
                        value={paymentSettings.keySecret}
                        onChange={(e) => { setPaymentSettings({...paymentSettings, keySecret: e.target.value}); onChanged(); }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleKeyVisibility('paySecret')}
                      >
                        {showKeys['paySecret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payWebhook">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="payWebhook"
                      type={showKeys['payWebhook'] ? 'text' : 'password'}
                      value={paymentSettings.webhookSecret}
                      onChange={(e) => { setPaymentSettings({...paymentSettings, webhookSecret: e.target.value}); onChanged(); }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility('payWebhook')}
                    >
                      {showKeys['payWebhook'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <TestTube2 className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Success Rate</p>
                <p className="text-2xl font-bold text-purple-700">94.2%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Failed Today</p>
                <p className="text-2xl font-bold text-purple-700">12</p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Volume (Today)</p>
                <p className="text-2xl font-bold text-purple-700">₹2.4L</p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Pending</p>
                <p className="text-2xl font-bold text-purple-700">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
