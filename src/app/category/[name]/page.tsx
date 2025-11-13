'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, MapPin, ArrowLeft, Filter, Heart, Star, Clock, Lock, ChevronLeft, ChevronRight, Maximize2, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Listing {
  id: string
  title: string
  price: number
  location: string
  city: string
  posted_at: string
  images: string[]
  category: string
  is_verified: boolean
  is_featured: boolean
  seller_name: string
  seller_type: 'individual' | 'dealer'
  views: number
  description?: string
  listing_type: 'free' | 'token'
  expires_at?: string
}

const categoryImages: Record<string, string[]> = {
  'Cars': [
    'https://images.pexels.com/photos/9834048/pexels-photo-9834048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/10042666/pexels-photo-10042666.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/13861487/pexels-photo-13861487.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/3849278/pexels-photo-3849278.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  ],
  'Bikes': [
    'https://images.pexels.com/photos/4488662/pexels-photo-4488662.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/13861669/pexels-photo-13861669.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/7675408/pexels-photo-7675408.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  ],
  'Mobiles': [
    'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/8000621/pexels-photo-8000621.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/7241413/pexels-photo-7241413.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1294875/pexels-photo-1294875.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  ],
  'Electronics': [
    'https://images.pexels.com/photos/4622188/pexels-photo-4622188.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/5668838/pexels-photo-5668838.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/4621967/pexels-photo-4621967.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  ],
  'Furniture': [
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1350778/pexels-photo-1350778.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1350788/pexels-photo-1350788.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  ]
}

const mockListingsByCategory: Record<string, Listing[]> = {
  'Cars': [
    {
      id: '2',
      title: 'Damaged Car - Front Bumper Damage',
      price: 185000,
      location: 'Palasia',
      city: 'Indore',
      posted_at: '5 hours ago',
      images: categoryImages['Cars'],
      category: 'Cars',
      is_verified: false,
      is_featured: true,
      seller_name: 'Auto World',
      seller_type: 'dealer',
      views: 567,
      description: 'Maruti Swift 2019 with front bumper damage from parking mishap. Engine perfect, all documents clear. AC, music system working. Minor repair needed.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '21',
      title: 'Accident Damaged Sedan - Side Impact',
      price: 225000,
      location: 'Vijay Nagar',
      city: 'Indore',
      posted_at: '1 day ago',
      images: categoryImages['Cars'],
      category: 'Cars',
      is_verified: true,
      is_featured: false,
      seller_name: 'Car Solutions',
      seller_type: 'dealer',
      views: 342,
      description: 'Honda City 2020 with side panel damage. Engine in excellent condition, all parts working. Insurance claimed. Quick sale needed.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '22',
      title: 'Used Hatchback - Minor Scratches',
      price: 145000,
      location: 'Rau',
      city: 'Indore',
      posted_at: '2 days ago',
      images: categoryImages['Cars'],
      category: 'Cars',
      is_verified: false,
      is_featured: false,
      seller_name: 'Rajesh Verma',
      seller_type: 'individual',
      views: 189,
      description: 'Hyundai i20 2018 model with minor body scratches. Well maintained, single owner, all services done on time.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '23',
      title: 'SUV with Engine Noise Issue',
      price: 395000,
      location: 'Bhawarkua',
      city: 'Indore',
      posted_at: '3 days ago',
      images: categoryImages['Cars'],
      category: 'Cars',
      is_verified: true,
      is_featured: false,
      seller_name: 'Premium Motors',
      seller_type: 'dealer',
      views: 654,
      description: 'Mahindra XUV500 2017 with engine knocking sound. Needs minor engine work. All documents clear, good body condition.',
      listing_type: 'token',
      expires_at: undefined
    }
  ],
  'Bikes': [
    {
      id: '7',
      title: 'Accident Damaged Motorcycle - Salvage',
      price: 22000,
      location: 'Rau',
      city: 'Indore',
      posted_at: '4 days ago',
      images: categoryImages['Bikes'],
      category: 'Bikes',
      is_verified: true,
      is_featured: true,
      seller_name: 'Bike Salvage',
      seller_type: 'dealer',
      views: 456,
      description: 'Bajaj Pulsar 220F accident damaged. Engine and gearbox intact and working. Frame bent, fuel tank dented. Good for parts or restoration project.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '24',
      title: 'Used Royal Enfield - Minor Issues',
      price: 68000,
      location: 'Vijay Nagar',
      city: 'Indore',
      posted_at: '1 day ago',
      images: categoryImages['Bikes'],
      category: 'Bikes',
      is_verified: false,
      is_featured: false,
      seller_name: 'Arjun Singh',
      seller_type: 'individual',
      views: 234,
      description: 'Royal Enfield Classic 350 with minor carburetor issues. Great condition otherwise. Single owner, all papers clear.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  'Mobiles': [
    {
      id: '1',
      title: 'Damaged iPhone 13 Pro - Cracked Screen',
      price: 28000,
      location: 'Vijay Nagar',
      city: 'Indore',
      posted_at: '2 hours ago',
      images: [
        'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/8000621/pexels-photo-8000621.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/7241413/pexels-photo-7241413.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: true,
      is_featured: true,
      seller_name: 'Rahul Sharma',
      seller_type: 'individual',
      views: 234,
      description: 'iPhone 13 Pro 256GB with cracked screen. Everything else working perfectly. Touch responsive, Face ID works, battery health 89%. Easy repair - display replacement only.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '25',
      title: 'Samsung Galaxy S21 - Back Glass Broken',
      price: 18500,
      location: 'Palasia',
      city: 'Indore',
      posted_at: '5 hours ago',
      images: [
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: true,
      is_featured: false,
      seller_name: 'Mobile Hub',
      seller_type: 'dealer',
      views: 189,
      description: 'Samsung Galaxy S21 128GB with broken back glass. Front screen perfect, all functions working. Camera, display, battery excellent. Easy back panel replacement.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '26',
      title: 'OnePlus 9 Pro - Display Issue',
      price: 22000,
      location: 'Bhawarkua',
      city: 'Indore',
      posted_at: '1 day ago',
      images: [
        'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1294875/pexels-photo-1294875.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: false,
      is_featured: false,
      seller_name: 'Techno Traders',
      seller_type: 'dealer',
      views: 156,
      description: 'OnePlus 9 Pro 256GB with green line on display. Phone works fine otherwise. All features functional. Good for parts or display replacement.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '27',
      title: 'iPhone 12 - Battery Drain Issue',
      price: 24000,
      location: 'Rau',
      city: 'Indore',
      posted_at: '2 days ago',
      images: [
        'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: true,
      is_featured: false,
      seller_name: 'Priya Patel',
      seller_type: 'individual',
      views: 287,
      description: 'iPhone 12 128GB with battery health at 68%. Fast battery drain. Everything else perfect - camera, Face ID, display. Just needs battery replacement.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '28',
      title: 'Xiaomi Mi 11X - Charging Port Damaged',
      price: 12500,
      location: 'Sapna Sangeeta',
      city: 'Indore',
      posted_at: '3 days ago',
      images: [
        'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: false,
      is_featured: false,
      seller_name: 'Amit Kumar',
      seller_type: 'individual',
      views: 123,
      description: 'Xiaomi Mi 11X 128GB with loose charging port. Charges only at certain angles. Phone in excellent condition otherwise. Simple port replacement needed.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '29',
      title: 'Vivo V21 - Camera Lens Cracked',
      price: 15000,
      location: 'Annapurna',
      city: 'Indore',
      posted_at: '4 days ago',
      images: [
        'https://images.pexels.com/photos/1294875/pexels-photo-1294875.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Mobiles',
      is_verified: false,
      is_featured: false,
      seller_name: 'Mobile Point',
      seller_type: 'dealer',
      views: 98,
      description: 'Vivo V21 5G 128GB with cracked rear camera lens. Front camera perfect. Display, battery, all features working. Rear camera needs lens replacement.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  'Furniture': [
    {
      id: '30',
      title: 'Wooden Sofa Set - Cushion Torn',
      price: 8500,
      location: 'Vijay Nagar',
      city: 'Indore',
      posted_at: '3 hours ago',
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: true,
      is_featured: true,
      seller_name: 'Furniture Hub',
      seller_type: 'dealer',
      views: 342,
      description: '5 seater wooden sofa set with torn cushions. Solid teak wood frame in excellent condition. Just needs cushion replacement or reupholstery. Very sturdy structure.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '31',
      title: 'Dining Table - Scratched Surface',
      price: 6500,
      location: 'Palasia',
      city: 'Indore',
      posted_at: '6 hours ago',
      images: [
        'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: true,
      is_featured: false,
      seller_name: 'Rajesh Verma',
      seller_type: 'individual',
      views: 234,
      description: '6 seater dining table with scratched top surface. Chairs in good condition. Solid wood construction. Can be refinished easily. Including 6 matching chairs.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '32',
      title: 'King Size Bed - Headboard Damaged',
      price: 12000,
      location: 'Bhawarkua',
      city: 'Indore',
      posted_at: '1 day ago',
      images: [
        'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1350778/pexels-photo-1350778.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: false,
      is_featured: false,
      seller_name: 'Home Decor Store',
      seller_type: 'dealer',
      views: 189,
      description: 'King size bed with cracked headboard. Base and mattress support perfect. Quality wood frame. Headboard can be repaired or replaced. No mattress included.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '33',
      title: 'Office Desk - Drawer Broken',
      price: 4500,
      location: 'Rau',
      city: 'Indore',
      posted_at: '2 days ago',
      images: [
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1350788/pexels-photo-1350788.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: true,
      is_featured: false,
      seller_name: 'Office Solutions',
      seller_type: 'dealer',
      views: 167,
      description: 'Large office desk with one broken drawer. Other 2 drawers working perfectly. Spacious work surface. Ideal for home office. Easy drawer fix needed.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '34',
      title: 'Wooden Almirah - Door Hinge Issue',
      price: 7500,
      location: 'Sapna Sangeeta',
      city: 'Indore',
      posted_at: '3 days ago',
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: false,
      is_featured: false,
      seller_name: 'Priya Patel',
      seller_type: 'individual',
      views: 145,
      description: 'Large 3 door wooden almirah with loose door hinges. Solid sheesham wood. Very spacious storage. Just needs hinge tightening or replacement. Good condition otherwise.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '35',
      title: 'Study Table - Leg Wobbly',
      price: 3200,
      location: 'Annapurna',
      city: 'Indore',
      posted_at: '4 days ago',
      images: [
        'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: false,
      is_featured: false,
      seller_name: 'Student Furniture',
      seller_type: 'individual',
      views: 98,
      description: 'Compact study table with one wobbly leg. Good for students. Includes storage shelf. Simple fix needed for leg stability. Perfect size for small rooms.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '36',
      title: 'Bookshelf - Back Panel Missing',
      price: 4800,
      location: 'Vijay Nagar',
      city: 'Indore',
      posted_at: '5 days ago',
      images: [
        'https://images.pexels.com/photos/1350788/pexels-photo-1350788.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: true,
      is_featured: false,
      seller_name: 'Book Corner',
      seller_type: 'dealer',
      views: 134,
      description: 'Tall bookshelf with missing back panel. 5 shelves, sturdy construction. Can be used open or back panel easily added. Great for organizing books and decorative items.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '37',
      title: 'Coffee Table - Glass Top Cracked',
      price: 2500,
      location: 'Palasia',
      city: 'Indore',
      posted_at: '1 week ago',
      images: [
        'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1350778/pexels-photo-1350778.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: false,
      is_featured: false,
      seller_name: 'Modern Living',
      seller_type: 'dealer',
      views: 87,
      description: 'Modern coffee table with cracked glass top. Metal frame in perfect condition. Easy glass replacement. Beautiful design for living room. Under-shelf for storage.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '38',
      title: 'TV Stand - Wheel Broken',
      price: 3800,
      location: 'Bhawarkua',
      city: 'Indore',
      posted_at: '1 week ago',
      images: [
        'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: true,
      is_featured: false,
      seller_name: 'Electronics & More',
      seller_type: 'dealer',
      views: 123,
      description: 'TV stand with one broken wheel. Can accommodate up to 55 inch TV. Multiple shelves for devices. Sturdy build. Simple wheel replacement needed. Dark wood finish.',
      listing_type: 'token',
      expires_at: undefined
    },
    {
      id: '39',
      title: 'Recliner Chair - Fabric Torn',
      price: 9500,
      location: 'Rau',
      city: 'Indore',
      posted_at: '1 week ago',
      images: [
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      ],
      category: 'Furniture',
      is_verified: false,
      is_featured: false,
      seller_name: 'Comfort Seating',
      seller_type: 'dealer',
      views: 156,
      description: 'Premium recliner chair with torn fabric on armrest. Reclining mechanism works perfectly. Very comfortable. Just needs reupholstery on one armrest. Great for reading or TV.',
      listing_type: 'free',
      expires_at: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryName = decodeURIComponent(params.name as string)
  
  const [listings, setListings] = useState<Listing[]>([])
  const [sortBy, setSortBy] = useState('recent')
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [cardImageIndexes, setCardImageIndexes] = useState<Record<string, number>>({})
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [showListingModal, setShowListingModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch listings from API filtered by category
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        // First try to fetch from API
        const response = await fetch(`http://localhost:3001/listings?category=${encodeURIComponent(categoryName)}`)
        if (response.ok) {
          const data = await response.json()
          // Transform API data to match our Listing interface
          const transformedListings: Listing[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price,
            location: item.location || 'Indore',
            city: item.location?.split(',')[1]?.trim() || 'Indore',
            posted_at: getTimeAgo(item.postedAt),
            images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=600&h=400&fit=crop'],
            category: item.category,
            is_verified: item.sellerType === 'dealer',
            is_featured: item.views > 300,
            seller_name: item.sellerName,
            seller_type: item.sellerType || 'individual',
            views: item.views || 0,
            description: item.description,
            listing_type: item.sellerType === 'dealer' ? 'token' : 'free',
            expires_at: item.sellerType !== 'dealer' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
          }))
          setListings(transformedListings)
        } else {
          // Fallback to mock data if API fails
          const categoryListings = mockListingsByCategory[categoryName] || []
          setListings(categoryListings)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        // Fallback to mock data
        const categoryListings = mockListingsByCategory[categoryName] || []
        setListings(categoryListings)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [categoryName])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const calculateDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const nextCardImage = (listingId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % totalImages
    }))
  }

  const prevCardImage = (listingId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  const handleSaveListing = (listingId: string) => {
    setSavedListings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(listingId)) {
        newSet.delete(listingId)
        toast.success('Removed from saved items')
      } else {
        newSet.add(listingId)
        toast.success('Added to saved items')
      }
      return newSet
    })
  }

  const openListingModal = (listing: Listing) => {
    setSelectedListing(listing)
    setShowListingModal(true)
    setCurrentImageIndex(0)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Cars': '🚗',
      'Bikes': '🏍️',
      'Mobiles': '📱',
      'Furniture': '🛋️',
      'Properties': '🏠',
      'Fashion': '👕',
      'Electronics': '💻'
    }
    return icons[category] || '📦'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">{getCategoryIcon(categoryName)}</span>
                  {categoryName}
                </h1>
                <p className="text-sm text-gray-500">{listings.length} items found</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">DGT</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Category Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-5xl mb-3">{getCategoryIcon(categoryName)}</div>
            <h2 className="text-2xl font-bold mb-2">
              Browse {categoryName} in Indore
            </h2>
            <p className="text-blue-100">
              Find the best deals on damaged, used, and repairable {categoryName.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={`Search in ${categoryName}...`}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="verified">Verified First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {categoryName}...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{getCategoryIcon(categoryName)}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {categoryName} Found
            </h3>
            <p className="text-gray-600 mb-6">
              There are no listings in this category yet. Check back soon!
            </p>
            <Button onClick={() => router.push('/')}>
              Browse All Categories
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <div 
                      className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden"
                      onClick={() => openListingModal(listing)}
                    >
                      <img 
                        src={listing.images[cardImageIndexes[listing.id] || 0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Image Navigation */}
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Indicators */}
                      {listing.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {listing.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === (cardImageIndexes[listing.id] || 0) ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="flex gap-1">
                        {listing.is_featured && (
                          <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                        )}
                        {listing.listing_type === 'token' && (
                          <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      {listing.listing_type === 'free' && listing.expires_at && (
                        <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {calculateDaysRemaining(listing.expires_at)}d left
                        </Badge>
                      )}
                    </div>
                    
                    {/* Save button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveListing(listing.id)
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart 
                        className={`w-4 h-4 ${savedListings.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                    
                    {/* Expand button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openListingModal(listing)
                      }}
                      className="absolute bottom-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <Maximize2 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="p-4" onClick={() => openListingModal(listing)}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {listing.title}
                    </h3>
                    
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      {formatPrice(listing.price)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{listing.location}, {listing.city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{listing.posted_at}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">•</span>
                        <span>{listing.views} views</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {listing.seller_name}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {listing.seller_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
