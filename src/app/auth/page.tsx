'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Globe, Eye, EyeOff, Phone, Lock, CheckCircle, Clock, User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AuthPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile')
  const [mobile, setMobile] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [maskedMobile, setMaskedMobile] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [demoOTP, setDemoOTP] = useState('')
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ]

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    if (authMode === 'signup' && !name.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile, 
          name: authMode === 'signup' ? name.trim() : undefined,
          email: authMode === 'signup' ? email.trim() : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMaskedMobile(data.maskedMobile)
        setDemoOTP(data.demoOTP || '1234')
        setStep('otp')
        setResendTimer(30)
        toast.success(`OTP sent to ${data.maskedMobile}`)
        
        // Auto-focus first OTP input
        setTimeout(() => {
          inputRefs[0].current?.focus()
        }, 100)
      } else {
        toast.error(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 4) {
      toast.error('Please enter complete OTP')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile, 
          otp: otpString,
          name: authMode === 'signup' ? name.trim() : undefined,
          email: authMode === 'signup' ? email.trim() : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const successMessage = authMode === 'signup' 
          ? 'Account created successfully!' 
          : 'Login successful!'
        
        toast.success(successMessage)
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        toast.error(data.error || 'Invalid OTP')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      })

      const data = await response.json()
      
      if (data.success) {
        setDemoOTP(data.demoOTP || '1234')
        setResendTimer(30)
        toast.success('OTP resent successfully')
      } else {
        toast.error(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setMobile(value)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-200 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="text-6xl font-bold text-blue-600">
                DGT
              </div>
              <div className="absolute inset-0 text-6xl font-bold text-blue-400 blur-xl animate-pulse">
                DGT
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sell Smart. Buy Damaged.
          </h1>
          <p className="text-gray-600 text-sm">
            India's trusted marketplace for damaged & repairable items
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              authMode === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Card */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <div className="p-8">
            {authMode === 'login' ? (
              /* Login Step */
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Enter your mobile number to continue
                  </p>
                </div>

                {step === 'mobile' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={mobile}
                          onChange={handleMobileChange}
                          className="flex-1 rounded-l-none pl-2"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading || mobile.length !== 10}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setStep('otp')
                          setMaskedMobile(`••••${mobile.slice(-4)}`)
                          setDemoOTP('1234')
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Already have OTP? Verify →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* OTP Verification Step */
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                          Verify OTP
                        </h2>
                      </div>
                      <p className="text-gray-600">
                        Enter 4-digit code sent to {maskedMobile}
                      </p>
                      {demoOTP && (
                        <p className="text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                          Demo OTP: {demoOTP}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={inputRefs[index]}
                            type={showOtp ? 'text' : 'password'}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setShowOtp(!showOtp)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <span className="text-sm text-gray-500">
                          {showOtp ? 'Hide' : 'Show'} OTP
                        </span>
                      </div>

                      <Button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.join('').length !== 4}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Verifying...
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Verify & Continue
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          onClick={handleResendOTP}
                          disabled={resendTimer > 0 || isLoading}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                        >
                          {resendTimer > 0 ? (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Resend OTP in {resendTimer}s
                            </span>
                          ) : (
                            'Resend OTP'
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => {
                            setStep('mobile')
                            setOtp(['', '', '', ''])
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          ← Change mobile number
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Signup Step */
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-600">
                    Join thousands buying & selling damaged items
                  </p>
                </div>

                {step === 'mobile' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-700">
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={mobile}
                          onChange={handleMobileChange}
                          className="flex-1 rounded-l-none pl-2"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        placeholder="Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading || mobile.length !== 10 || !name.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        'Create Account & Send OTP'
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setStep('otp')
                          setMaskedMobile(`••••${mobile.slice(-4)}`)
                          setDemoOTP('1234')
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Already have OTP? Verify →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* OTP Verification Step for Signup */
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">
                          Verify Your Number
                        </h2>
                      </div>
                      <p className="text-gray-600">
                        Enter 4-digit code sent to {maskedMobile}
                      </p>
                      {demoOTP && (
                        <p className="text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                          Demo OTP: {demoOTP}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={inputRefs[index]}
                            type={showOtp ? 'text' : 'password'}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setShowOtp(!showOtp)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <span className="text-sm text-gray-500">
                          {showOtp ? 'Hide' : 'Show'} OTP
                        </span>
                      </div>

                      <Button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.join('').length !== 4}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Creating Account...
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          onClick={handleResendOTP}
                          disabled={resendTimer > 0 || isLoading}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                        >
                          {resendTimer > 0 ? (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Resend OTP in {resendTimer}s
                            </span>
                          ) : (
                            'Resend OTP'
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => {
                            setStep('mobile')
                            setOtp(['', '', '', ''])
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          ← Change details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <button
                  onClick={() => router.push('/')}
                  className="hover:text-gray-700 flex items-center"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Continue as Guest
                </button>
                <span>•</span>
                <button className="hover:text-gray-700 flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  English
                </button>
              </div>
              
              <div className="text-center mt-4 text-xs text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a> and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-gray-600 text-sm">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span>Secure</span>
          </div>
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            <span>Private</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}