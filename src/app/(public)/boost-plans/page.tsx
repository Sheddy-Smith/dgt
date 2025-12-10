'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Zap, TrendingUp, Star, Check, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const BOOST_PLANS = [
  {
    id: 'basic',
    name: 'Basic Boost',
    icon: Zap,
    duration: '7 days',
    price: 99,
    features: [
      '2x visibility in search results',
      'Highlighted listing badge',
      'Priority in category listings',
      'Email support'
    ],
    color: 'text-blue-500'
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    icon: TrendingUp,
    duration: '15 days',
    price: 249,
    popular: true,
    features: [
      '5x visibility in search results',
      'Featured in homepage carousel',
      'Top of search results',
      'Premium badge',
      'Priority email & chat support',
      'Analytics dashboard'
    ],
    color: 'text-amber-500'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Boost',
    icon: Rocket,
    duration: '30 days',
    price: 499,
    features: [
      '10x visibility in search results',
      'Featured across platform',
      'Guaranteed top position',
      'Premium + Verified badges',
      'Dedicated support manager',
      'Advanced analytics',
      'Social media promotion',
      'Free ad renewal'
    ],
    color: 'text-purple-500'
  }
]

export default function BoostPlansPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleBoost = async (planId: string, price: number) => {
    // Check wallet balance - mock implementation
    const walletBalance = 1500 // Mock balance
    
    if (walletBalance < price) {
      router.push(`/wallet?action=topup&amount=${price}`)
      return
    }

    // Process boost payment
    console.log(`Boosting with plan: ${planId}`)
    router.push('/profile')
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Boost Your Ad</h1>
          <p className="text-sm text-muted-foreground">Get more visibility and sell faster</p>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="mb-6 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Why Boost Your Ad?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-white p-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">10x More Views</h3>
                <p className="text-sm text-muted-foreground">Get significantly more eyeballs on your listing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-white p-2 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Sell 3x Faster</h3>
                <p className="text-sm text-muted-foreground">Boosted ads sell much quicker than regular ads</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-white p-2 rounded-lg">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Top Placement</h3>
                <p className="text-sm text-muted-foreground">Your ad appears at the top of search results</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {BOOST_PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-amber-500 border-2' : ''} ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-8 w-8 ${plan.color}`} />
                  <Badge variant="secondary">{plan.duration}</Badge>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">₹{plan.price}</span>
                  <span className="text-muted-foreground"> / {plan.duration}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleBoost(plan.id, plan.price)}
                >
                  Boost Now
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">How does boosting work?</h3>
            <p className="text-sm text-muted-foreground">
              Boosting places your ad at the top of search results and category pages, making it more visible to potential buyers.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Can I boost multiple ads?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can boost as many ads as you want. Each ad requires a separate boost plan.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">What happens after boost expires?</h3>
            <p className="text-sm text-muted-foreground">
              Your ad will return to normal visibility. You can renew the boost anytime to maintain top placement.
            </p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Can I get a refund?</h3>
            <p className="text-sm text-muted-foreground">
              Refunds are available within 24 hours of purchase if your ad hasn't received any views yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
