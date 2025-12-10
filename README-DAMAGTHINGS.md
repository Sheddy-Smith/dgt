# 🛒 DamagThings - Frontend + Demo Backend (3 Pillars)

**DamagThings.com** is an online marketplace for damaged, used, and repairable items with a token-based contact system, built on **3 core pillars**.

## 🏛️ **The 3 Pillars**

### 1. 📍 **Location-Based Listings**
- **Everything near you** - Har cheez local banayi gayi hai
- Find damaged items in your local area within minutes
- Distance-based sorting and filtering
- City-wise listings with proximity indicators
- **Benefit**: No shipping costs, immediate inspection, local transactions

### 2. 🔍 **Category-Based Search**
- **Advanced filters** - Buyers ko exact product milta hai
- Smart categories: Appliances, Vehicles, Electronics, Furniture, Mobile Phones
- Condition filters: Needs Repair, Used, For Parts, Damaged
- Price range filtering and sorting
- Urgency indicators (Quick Sale, Best Offer)
- **Benefit**: Precise matching, saves time, better buying decisions

### 3. 🛡️ **Trust & Simplicity**
- **Low-cost, fast, transparent** posting system
- Verified seller badges and ratings
- Honest condition descriptions required
- Simple 3-step posting process
- Transparent pricing with negotiable options
- **Benefit**: Builds confidence, reduces fraud, faster transactions

## 🚀 Quick Start

### 1. Start the Main Application (Next.js Frontend)
```bash
npm run dev
```
The app will be available at: **http://localhost:3000**

### 2. Start the Demo Backend (JSON Server)
Open a new terminal and run:
```bash
npm run demo-server
```
The API will be available at: **http://localhost:3001**

Available endpoints:
- http://localhost:3001/users
- http://localhost:3001/listings  
- http://localhost:3001/transactions

## 📱 Enhanced Demo Features

### 🔐 Authentication (Mock)
- **Login**: Click "Login" button
- **Mobile**: Enter any 10-digit number
- **OTP**: Use `123456` (shown in console)
- **Storage**: User data saved in localStorage

### 📍 **Location-Based Features**
- **Current location display** in header
- **City-wise listings**: Delhi, Mumbai, Bangalore, Chennai, Kolkata
- **Distance indicators**: Shows how far each item is from you
- **Location filtering**: Filter by specific cities
- **Distance sorting**: Find nearest items first

### 🔍 **Enhanced Category Search**
- **Multiple filter options**:
  - Category: Appliances, Vehicles, Electronics, Furniture, Mobile Phones, Computer Parts
  - Condition: Needs Repair, Used, For Parts, Damaged
  - Price Range: Under ₹5k, ₹5k-20k, ₹20k-50k, Above ₹50k
  - Urgency: Quick Sale, Best Offer, Urgent
- **Advanced sorting**: Recent, Price (Low/High), Distance, Seller Rating
- **Trust filters**: Verified sellers, 4+ rated sellers
- **Smart search**: Search in titles and descriptions

### 🛡️ **Trust & Simplicity Features**
- **Verified seller badges** with checkmarks
- **Seller ratings** displayed with star ratings
- **Urgency indicators** (Urgent, Normal, No Rush)
- **Negotiable pricing** options
- **Fast posting** with 3-step process
- **Transparent descriptions** required
- **🛡️ VERIFICATION SYSTEM**:
  - **Default expiry**: 30 days from posting
  - **Token verification**: Spend 1 token to verify listing
  - **Verified benefits**: No expiry, blue border, special badge
  - **Admin override**: Can set no-expiry for special listings
  - **Refund system**: Admin can refund tokens in fraud cases

### 🏪 Token System
- **Free users start with 0 tokens**
- **Buy tokens** from wallet section:
  - 6 Tokens - ₹50 (5 + 1 Free)
  - 13 Tokens - ₹100 (10 + 3 Free)
  - 19 Tokens - ₹150 (15 + 4 Free)
  - 26 Tokens - ₹200 (20 + 6 Free)
- **Token uses**:
  - **Unlock contact**: 1 token per listing
  - **Verify listing**: 1 token (removes expiry)
- **Payment**: Mock payment (console log)

### 🛡️ **Verification Rules (Implemented)**
- **✅ Default expiry**: Listing created_at + 30 days auto-expire
- **✅ Verify action**: Seller spends 1 token to mark listing as verified
- **✅ On success**: is_verified = true, verified_at = now(), expiry = NULL
- **✅ Atomic transaction**: Token deducted and logged immediately
- **✅ Non-refundable**: Verification tokens non-refundable by default
- **✅ Admin refund**: Admin can manually unverify/refund in fraud cases
- **✅ Re-verify**: Seller can re-verify after unverify by spending another token
- **✅ Admin override**: Admin can set no-expiry or extend expiry for special listings

### 📦 Listings Management
- **Browse listings** with search and filters
- **Post new listings** (login required)
- **View your listings** from profile
- **Contact unlock**: 1 token per listing

### 🔒 Contact Unlock System
- **Free browsing**: View all listings without login
- **Contact unlock**: 1 token to reveal seller number
- **Token deduction**: Automatic when unlocking

### 🛠️ Admin Panel
Access at: **http://localhost:3000/admin**
- **User management**: View users, update tokens
- **Listing management**: Approve/reject listings
- **Transaction history**: View all transactions
- **Statistics**: Dashboard with key metrics

## 🎯 Enhanced User Flow Examples

### For Buyers (Location + Category + Trust):
1. **Visit homepage** → See your current location (Delhi)
2. **Browse local listings** → Filter by distance and category
3. **Apply smart filters** → Find exact condition and price range
4. **Check trust indicators** → Look for verified sellers and ratings
5. **Login with mobile + OTP** → Quick verification (123456)
6. **Buy tokens** → Purchase from wallet (₹50 for 6 tokens)
7. **Unlock contact** → Use 1 token to get seller's number
8. **Contact locally** → Meet nearby, inspect item, complete deal

### For Sellers (Trust & Simplicity):
1. **Login with mobile + OTP** → Fast verification
2. **Click "Post New Listing"** → Simple 3-step process
3. **Fill location + details** → Select city, condition, urgency
4. **Set trust features** → Enable negotiable, honest description
5. **Post instantly** → Visible to local buyers immediately
6. **Get verified** → Build trust, get 3x more responses
7. **Receive buyer contacts** → Genuine, local, interested buyers

## 🗂️ Project Structure

```
├── src/app/
│   ├── page.tsx              # Main homepage
│   ├── admin/page.tsx        # Admin panel
│   └── layout.tsx            # App layout
├── components/ui/            # shadcn/ui components
├── db.json                   # Demo backend data
├── server-demo.js            # Demo backend server
└── package.json
```

## 📊 Mock Data

### Sample Listings (Location + Trust Enhanced):
- **Damaged Refrigerator** - ₹8,000 (Delhi, 2.5km, Verified ⭐4.5)
- **Used Motorcycle** - ₹45,000 (Mumbai, 5.1km, Verified ⭐4.2)
- **Broken Washing Machine** - ₹3,500 (Bangalore, 1.8km, ⭐3.8)
- **Damaged Mobile Phone** - ₹12,000 (Delhi, 3.2km, Verified ⭐4.7)
- **Old Wooden Sofa** - ₹6,500 (Mumbai, 4.5km, ⭐4.0, Negotiable)

### Sample Users:
- 9876543210 (5 tokens)
- 9123456789 (12 tokens)
- 9988776655 (0 tokens)

## 🔧 Available API Endpoints (Demo Backend)

### Basic CRUD Operations:
- `GET /users` - Get all users
- `GET /listings` - Get all listings
- `GET /transactions` - Get all transactions
- `POST /users` - Create new user
- `POST /listings` - Create new listing
- `PUT /users/:id` - Update user
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

*Note: This demo uses mock data in the frontend. The backend is for demonstration purposes.*

## 🎨 UI Components Used

- **Cards**: For listings and stats
- **Dialogs**: Login, post listing, wallet
- **Tables**: Admin panel data
- **Forms**: Input validation and submission
- **Badges**: Status indicators
- **Tabs**: Admin panel navigation
- **Buttons**: Primary/secondary actions

## 🧪 Testing Checklist (Enhanced with Verification)

### Manual Testing Steps:
1. **Authentication Flow**:
   - [ ] Login with mobile + OTP (123456)
   - [ ] Logout and login again
   - [ ] Check localStorage persistence

2. **Token System**:
   - [ ] Buy token bundles
   - [ ] Check wallet balance
   - [ ] Unlock contact (token deduction)

3. **Verification System**:
   - [ ] Post new listing (shows 30-day expiry)
   - [ ] Verify listing with 1 token (removes expiry)
   - [ ] Check verified badge and blue border
   - [ ] Try verification with insufficient tokens
   - [ ] Check transaction log for verification

4. **Expiry System**:
   - [ ] View expiry date on unverified listings
   - [ ] Check that verified listings show "No expiry"
   - [ ] Test expired listing filtering (demo item)

5. **Admin Panel Verification**:
   - [ ] Admin verify listing (no token required)
   - [ ] Admin unverify listing
   - [ ] Admin refund verification tokens
   - [ ] Admin set no-expiry override
   - [ ] Check verification transactions in admin

6. **Listings Management**:
   - [ ] Browse and search listings
   - [ ] Post new listing
   - [ ] View own listings
   - [ ] Contact unlock functionality

7. **Admin Panel**:
   - [ ] View user statistics
   - [ ] Update user tokens
   - [ ] Approve/reject listings
   - [ ] View transaction history

## 🚀 Next Steps

This demo validates the core concept. For production:

1. **Real Backend**: Replace json-server with Node.js + SQL
2. **Real OTP**: Integrate TexGuru SMS service
3. **Real Payments**: Integrate Razorpay
4. **Image Upload**: Add file upload functionality
5. **Enhanced UI**: Add animations and better UX
6. **Mobile App**: React Native version

## 📞 Support

For demo issues:
1. Check console for errors
2. Ensure both servers are running (ports 3000 & 3001)
3. Clear localStorage if needed
4. Use OTP: 123456 for all logins

---

**Built with**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui + json-server