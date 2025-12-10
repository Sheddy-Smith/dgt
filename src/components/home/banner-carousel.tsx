'use client'

import { useState, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'

interface Banner {
  id: string
  title: string
  image: string
  link: string
  placement: string
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBanners: Banner[] = [
        {
          id: '1',
          title: 'Year End Sale',
          image: '/api/placeholder/800/300',
          link: '/categories/electronics',
          placement: 'home'
        },
        {
          id: '2',
          title: 'Boost Your Listings',
          image: '/api/placeholder/800/300',
          link: '/boost-plans',
          placement: 'home'
        },
        {
          id: '3',
          title: 'New Categories',
          image: '/api/placeholder/800/300',
          link: '/categories',
          placement: 'home'
        }
      ]
      
      setBanners(mockBanners)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      setLoading(false)
    }
  }

  const trackBannerClick = (bannerId: string) => {
    // Send analytics event
    console.log('Banner clicked:', bannerId)
  }

  if (loading) {
    return <Skeleton className="w-full h-48 rounded-lg" />
  }

  if (banners.length === 0) return null

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <Link 
              href={banner.link}
              onClick={() => trackBannerClick(banner.id)}
            >
              <Card className="overflow-hidden border-0">
                <div className="relative w-full h-48">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={banners[0].id === banner.id}
                  />
                </div>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  )
}
