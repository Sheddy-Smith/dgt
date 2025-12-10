const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  console.log('Creating categories...');
  
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: '📱',
      order: 1,
      subcategories: [
        { name: 'Mobiles', slug: 'mobiles', icon: '📱', order: 1 },
        { name: 'Laptops', slug: 'laptops', icon: '💻', order: 2 },
        { name: 'Tablets', slug: 'tablets', icon: '📱', order: 3 },
        { name: 'TVs', slug: 'tvs', icon: '📺', order: 4 }
      ]
    },
    {
      name: 'Vehicles',
      slug: 'vehicles',
      icon: '🚗',
      order: 2,
      subcategories: [
        { name: 'Cars', slug: 'cars', icon: '🚗', order: 1 },
        { name: 'Bikes', slug: 'bikes', icon: '🏍️', order: 2 },
        { name: 'Scooters', slug: 'scooters', icon: '🛵', order: 3 }
      ]
    },
    {
      name: 'Property',
      slug: 'property',
      icon: '🏠',
      order: 3,
      subcategories: [
        { name: 'Houses', slug: 'houses', icon: '🏠', order: 1 },
        { name: 'Apartments', slug: 'apartments', icon: '🏢', order: 2 },
        { name: 'Plots', slug: 'plots', icon: '🏞️', order: 3 }
      ]
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      icon: '👗',
      order: 4,
      subcategories: [
        { name: 'Men', slug: 'men-fashion', icon: '👔', order: 1 },
        { name: 'Women', slug: 'women-fashion', icon: '👗', order: 2 },
        { name: 'Kids', slug: 'kids-fashion', icon: '👶', order: 3 }
      ]
    },
    {
      name: 'Furniture',
      slug: 'furniture',
      icon: '🪑',
      order: 5,
      subcategories: [
        { name: 'Sofa & Chairs', slug: 'sofa-chairs', icon: '🛋️', order: 1 },
        { name: 'Beds', slug: 'beds', icon: '🛏️', order: 2 },
        { name: 'Tables', slug: 'tables', icon: '🪑', order: 3 }
      ]
    }
  ];

  for (const category of categories) {
    const { subcategories, ...categoryData } = category;
    
    const createdCategory = await prisma.category.create({
      data: {
        ...categoryData,
        isActive: true
      }
    });

    if (subcategories) {
      for (const sub of subcategories) {
        await prisma.category.create({
          data: {
            ...sub,
            parentId: createdCategory.id,
            isActive: true
          }
        });
      }
    }
  }

  // Create boost plans
  console.log('Creating boost plans...');
  await prisma.boostPlan.createMany({
    data: [
      {
        name: 'Basic Boost',
        description: 'Featured for 3 days',
        price: 49.00,
        durationDays: 3,
        features: JSON.stringify(['Top of search results', 'Featured badge']),
        isActive: true
      },
      {
        name: 'Standard Boost',
        description: 'Featured for 7 days',
        price: 99.00,
        durationDays: 7,
        features: JSON.stringify(['Top of search results', 'Featured badge', 'Social media share']),
        isActive: true
      },
      {
        name: 'Premium Boost',
        description: 'Featured for 15 days',
        price: 179.00,
        durationDays: 15,
        features: JSON.stringify(['Top of search results', 'Featured badge', 'Social media share', 'Email promotion']),
        isActive: true
      }
    ]
  });

  // Create admin user
  console.log('Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      phone: '+919999999999',
      email: 'admin@dgt.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phoneVerified: true,
      emailVerified: true,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    }
  });

  // Create wallet for admin
  await prisma.wallet.create({
    data: {
      userId: adminUser.id,
      balance: 0,
      holdBalance: 0,
      totalCredits: 0,
      totalDebits: 0
    }
  });

  // Create some settings
  console.log('Creating default settings...');
  await prisma.setting.createMany({
    data: [
      {
        key: 'platform_name',
        value: 'DGT Marketplace',
        type: 'string',
        category: 'general'
      },
      {
        key: 'support_email',
        value: 'support@dgt.com',
        type: 'string',
        category: 'general'
      },
      {
        key: 'listing_expiry_days',
        value: '30',
        type: 'number',
        category: 'listings'
      },
      {
        key: 'max_images_per_listing',
        value: '10',
        type: 'number',
        category: 'listings'
      },
      {
        key: 'min_payout_amount',
        value: '100',
        type: 'number',
        category: 'payments'
      },
      {
        key: 'platform_commission',
        value: '5',
        type: 'number',
        category: 'payments'
      }
    ]
  });

  // Create feature flags
  console.log('Creating feature flags...');
  await prisma.featureFlag.createMany({
    data: [
      {
        name: 'listing_boost',
        description: 'Enable listing boost feature',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        name: 'chat_messaging',
        description: 'Enable in-app chat between buyers and sellers',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        name: 'wallet_topup',
        description: 'Enable wallet top-up feature',
        enabled: true,
        rolloutPercentage: 100
      },
      {
        name: 'kyc_verification',
        description: 'Require KYC for high-value transactions',
        enabled: true,
        rolloutPercentage: 100
      }
    ]
  });

  console.log('✅ Database seeding completed!');
  console.log(`Admin credentials: Phone: +919999999999, Name: Super Admin`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
