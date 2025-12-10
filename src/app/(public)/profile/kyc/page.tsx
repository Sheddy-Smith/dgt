'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload, ShieldCheck, Camera, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const KYC_STEPS = [
  { id: 1, title: 'Personal Details', icon: FileText },
  { id: 2, title: 'ID Verification', icon: Camera },
  { id: 3, title: 'Review & Submit', icon: CheckCircle2 }
]

export default function KYCPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    address: '',
    pincode: '',
    idType: 'aadhaar',
    idNumber: '',
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null
  })

  const progress = (step / KYC_STEPS.length) * 100

  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, [field]: file })
    }
  }

  const handleSubmit = async () => {
    console.log('Submitting KYC:', formData)
    // Mock API call
    setTimeout(() => {
      router.push('/profile?kyc=success')
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">Verify your identity in 3 simple steps</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between">
          {KYC_STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={s.id} className={`flex flex-col items-center ${step > idx ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step > idx ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-center">{s.title}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter your details as per your government ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="As per ID proof"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="6-digit pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
            <Button 
              className="w-full"
              disabled={!formData.fullName || !formData.dob || !formData.address || !formData.pincode}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: ID Verification */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ID Document</CardTitle>
              <CardDescription>Upload clear photos of your government-issued ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['aadhaar', 'pan', 'passport'].map((type) => (
                    <Button
                      key={type}
                      variant={formData.idType === type ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, idType: type })}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  placeholder={`Enter ${formData.idType} number`}
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ID Front */}
              <div>
                <Label>ID Front Side *</Label>
                <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {formData.idFront ? formData.idFront.name : 'Upload front side'}
                  </p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('idFront')} />
                </label>
              </div>

              {/* ID Back */}
              <div>
                <Label>ID Back Side *</Label>
                <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {formData.idBack ? formData.idBack.name : 'Upload back side'}
                  </p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('idBack')} />
                </label>
              </div>

              {/* Selfie */}
              <div>
                <Label>Selfie with ID *</Label>
                <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {formData.selfie ? formData.selfie.name : 'Upload selfie holding ID'}
                  </p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('selfie')} />
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              className="flex-1"
              disabled={!formData.idNumber || !formData.idFront || !formData.idBack || !formData.selfie}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Details</CardTitle>
              <CardDescription>Please verify all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{formData.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-medium">{formData.dob}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-right">{formData.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Pincode</span>
                <span className="font-medium">{formData.pincode}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">ID Type</span>
                <span className="font-medium capitalize">{formData.idType}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">ID Number</span>
                <span className="font-medium">{formData.idNumber}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Verification Process
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Your documents will be reviewed within 24-48 hours. You'll receive a notification once verified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSubmit}>
              Submit for Verification
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
