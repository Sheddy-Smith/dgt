# DamagThings Admin Panel

Standalone admin panel for DamagThings marketplace platform.

## Features

- 📊 **Dashboard Analytics** - Overview of users, listings, and revenue
- 👥 **User Management** - View, edit, and manage user accounts
- 📦 **Listing Management** - Approve, reject, and moderate listings  
- 💰 **Transaction Tracking** - Monitor all token purchases and usage
- 📈 **Charts & Reports** - Visual insights with Recharts
- 🔐 **Secure Login** - Admin authentication system

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The admin panel will be available at: **http://localhost:3002**

## Default Credentials

- **Password**: `admin123`

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
```

## Deployment

### For Subdomain (admin.damagthings.com)

1. Build the project:
```bash
npm run build
```

2. The build output will be in `.next/standalone`

3. Configure your server (Nginx/Apache) to point subdomain to this build

### Example Nginx Config

```nginx
server {
    server_name admin.damagthings.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

## API Integration

Connects to JSON Server backend on port 3001:
- `/users` - User data
- `/listings` - Listing data
- `/transactions` - Transaction history

## Features Overview

### Dashboard
- Real-time statistics cards
- Weekly trends chart
- Revenue analysis
- New user/listing tracking

### User Management
- View all registered users
- Edit user token balance
- Delete user accounts
- Track online/offline status

### Listing Management
- View all listings
- Activate/deactivate listings
- Delete listings
- Monitor views and engagement

### Transactions
- Complete transaction history
- Filter by type (purchase/unlock/verify/refund)
- Track revenue from token sales

## Production Deployment

For production, update `.env.local` with production URLs:

```env
NEXT_PUBLIC_API_URL=https://api.damagthings.com
NEXT_PUBLIC_MAIN_APP_URL=https://damagthings.com
```

Then build and deploy:

```bash
npm run build
npm run start
```

## Security Notes

⚠️ **Important**: Change the default admin password before deploying to production. Implement proper authentication with:
- JWT tokens
- Session management
- Role-based access control
- Password hashing

## License

Proprietary - DamagThings Platform
