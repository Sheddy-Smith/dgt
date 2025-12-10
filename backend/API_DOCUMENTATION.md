# DGT Marketplace API Documentation

## Base URL
```
Production: https://api.yourdomain.com
Development: http://localhost:4000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication API

### 1.1 Send OTP
Send OTP to user's phone number.

**Endpoint:** `POST /api/auth/send-otp`

**Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response:** `200 OK`
```json
{
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**Rate Limit:** 3 requests per 15 minutes per phone number

---

### 1.2 Verify OTP & Login
Verify OTP and receive JWT tokens.

**Endpoint:** `POST /api/auth/verify-otp`

**Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "deviceToken": "fcm_device_token_here"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

---

### 1.3 Refresh Token
Get new access token using refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

### 1.4 Logout
Logout and invalidate tokens.

**Endpoint:** `POST /api/auth/logout`  
**Auth:** Required

**Body:**
```json
{
  "deviceToken": "fcm_device_token_here"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Listings API

### 2.1 Get All Listings
Get listings with filters and pagination.

**Endpoint:** `GET /api/listings`

**Query Parameters:**
- `categoryId` (optional) - Filter by category
- `search` (optional) - Search in title/description
- `minPrice` (optional) - Minimum price
- `maxPrice` (optional) - Maximum price
- `status` (optional) - ACTIVE, SOLD, EXPIRED (default: ACTIVE)
- `sortBy` (optional) - createdAt, price, views (default: createdAt)
- `sortOrder` (optional) - asc, desc (default: desc)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "listing_id",
      "title": "iPhone 13 Pro",
      "description": "Excellent condition...",
      "price": 55000,
      "categoryId": "cat_id",
      "category": {
        "id": "cat_id",
        "name": "Mobiles"
      },
      "seller": {
        "id": "user_id",
        "name": "John Doe",
        "phone": "+919876543210"
      },
      "location": {"city": "Mumbai", "state": "Maharashtra"},
      "images": ["url1", "url2"],
      "isBoosted": true,
      "views": 245,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 2.2 Get Single Listing
Get detailed listing information.

**Endpoint:** `GET /api/listings/:id`

**Response:** `200 OK`
```json
{
  "id": "listing_id",
  "title": "iPhone 13 Pro",
  "description": "Excellent condition...",
  "price": 55000,
  "negotiable": true,
  "category": {
    "id": "cat_id",
    "name": "Mobiles",
    "parentId": "parent_id"
  },
  "seller": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "+919876543210",
    "createdAt": "2023-06-01T00:00:00Z",
    "_count": {
      "listings": 12
    }
  },
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "images": ["url1", "url2", "url3"],
  "attributes": {
    "brand": "Apple",
    "storage": "256GB",
    "color": "Graphite"
  },
  "status": "ACTIVE",
  "isBoosted": true,
  "boostedUntil": "2024-02-15T10:30:00Z",
  "views": 245,
  "expiresAt": "2024-03-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "_count": {
    "favorites": 15
  }
}
```

---

### 2.3 Create Listing
Create a new listing.

**Endpoint:** `POST /api/listings`  
**Auth:** Required

**Body:**
```json
{
  "title": "iPhone 13 Pro",
  "description": "Excellent condition, minimal scratches",
  "price": 55000,
  "categoryId": "cat_id",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "images": ["url1", "url2"],
  "attributes": {
    "brand": "Apple",
    "storage": "256GB"
  },
  "negotiable": true
}
```

**Response:** `201 Created`
```json
{
  "id": "listing_id",
  "title": "iPhone 13 Pro",
  "status": "PENDING",
  "expiresAt": "2024-02-14T10:30:00Z",
  ...
}
```

---

### 2.4 Update Listing
Update existing listing.

**Endpoint:** `PUT /api/listings/:id`  
**Auth:** Required (Owner or Admin)

**Body:**
```json
{
  "title": "iPhone 13 Pro - Updated",
  "price": 52000,
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

### 2.5 Delete Listing
Delete a listing.

**Endpoint:** `DELETE /api/listings/:id`  
**Auth:** Required (Owner or Admin)

**Response:** `200 OK`
```json
{
  "message": "Listing deleted successfully"
}
```

---

### 2.6 Review Listing (Admin)
Approve or reject a listing.

**Endpoint:** `POST /api/listings/:id/review`  
**Auth:** Required (Admin/Moderator)

**Body:**
```json
{
  "action": "approve",  // or "reject"
  "reason": "Violates policy"  // required if reject
}
```

**Response:** `200 OK`

---

### 2.7 Boost Listing
Boost a listing for better visibility.

**Endpoint:** `POST /api/listings/:id/boost`  
**Auth:** Required (Owner)

**Body:**
```json
{
  "planId": "boost_plan_id"
}
```

**Response:** `200 OK`
```json
{
  "message": "Listing boosted successfully",
  "listing": {
    "id": "listing_id",
    "isBoosted": true,
    "boostedUntil": "2024-02-22T10:30:00Z"
  },
  "balance": 450.00
}
```

---

### 2.8 Mark as Sold
Mark a listing as sold.

**Endpoint:** `POST /api/listings/:id/sold`  
**Auth:** Required (Owner)

**Response:** `200 OK`

---

## 3. Wallet API

### 3.1 Get Wallet
Get wallet details.

**Endpoint:** `GET /api/wallet`  
**Auth:** Required

**Response:** `200 OK`
```json
{
  "id": "wallet_id",
  "userId": "user_id",
  "balance": 1500.00,
  "holdBalance": 200.00,
  "totalCredits": 5000.00,
  "totalDebits": 3500.00,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 3.2 Get Transactions
Get wallet transaction history.

**Endpoint:** `GET /api/wallet/transactions`  
**Auth:** Required

**Query Parameters:**
- `type` (optional) - Transaction type
- `status` (optional) - completed, pending, failed
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "txn_id",
      "type": "CREDIT_TOPUP",
      "amount": 500.00,
      "balanceBefore": 1000.00,
      "balanceAfter": 1500.00,
      "description": "Wallet top-up",
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### 3.3 Get Wallet Stats
Get wallet statistics.

**Endpoint:** `GET /api/wallet/stats`  
**Auth:** Required

**Response:** `200 OK`
```json
{
  "balance": 1500.00,
  "holdBalance": 200.00,
  "totalCredits": 5000.00,
  "totalDebits": 3500.00,
  "last30Days": {
    "credits": 1200.00,
    "debits": 800.00,
    "transactionCount": 25
  }
}
```

---

## 4. Payments API

### 4.1 Create Order
Create Razorpay order for wallet top-up.

**Endpoint:** `POST /api/payments/order`  
**Auth:** Required

**Body:**
```json
{
  "amount": 500
}
```

**Response:** `200 OK`
```json
{
  "orderId": "order_xyz123",
  "amount": 500,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

---

### 4.2 Verify Payment
Verify payment and credit wallet.

**Endpoint:** `POST /api/payments/verify`  
**Auth:** Required

**Body:**
```json
{
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456",
  "signature": "signature_hash"
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment verified and wallet credited",
  "balance": 1500.00
}
```

---

### 4.3 Create Refund (Admin)
Process a refund.

**Endpoint:** `POST /api/payments/refund`  
**Auth:** Required (Admin/Finance)

**Body:**
```json
{
  "transactionId": "txn_id",
  "amount": 500,  // optional for partial refund
  "reason": "Customer request"
}
```

**Response:** `200 OK`

---

## 5. Payouts API

### 5.1 Request Payout
Request a payout to bank account.

**Endpoint:** `POST /api/payouts/request`  
**Auth:** Required

**Body:**
```json
{
  "amount": 1000,
  "bankDetails": {
    "accountHolderName": "John Doe",
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountType": "savings"
  }
}
```

**Response:** `201 Created`

---

### 5.2 Get Payouts
Get user's payout requests.

**Endpoint:** `GET /api/payouts`  
**Auth:** Required

**Response:** `200 OK`

---

### 5.3 Get All Payouts (Admin)
Get all payout requests.

**Endpoint:** `GET /api/payouts/all`  
**Auth:** Required (Admin/Finance)

**Response:** `200 OK`

---

### 5.4 Process Payout (Admin)
Process a payout request.

**Endpoint:** `POST /api/payouts/:id/process`  
**Auth:** Required (Admin/Finance)

**Response:** `200 OK`

---

### 5.5 Reject Payout (Admin)
Reject a payout request.

**Endpoint:** `POST /api/payouts/:id/reject`  
**Auth:** Required (Admin/Finance)

**Body:**
```json
{
  "reason": "Invalid bank details"
}
```

---

### 5.6 Cancel Payout
Cancel own payout request.

**Endpoint:** `POST /api/payouts/:id/cancel`  
**Auth:** Required

---

## 6. Categories API

### 6.1 Get All Categories
Get all categories.

**Endpoint:** `GET /api/categories`

**Response:** `200 OK`

---

### 6.2 Get Category Tree
Get hierarchical category tree.

**Endpoint:** `GET /api/categories/tree`

**Response:** `200 OK`

---

## 7. Notifications API

### 7.1 Get Notifications
Get user notifications.

**Endpoint:** `GET /api/notifications`  
**Auth:** Required

**Query Parameters:**
- `unreadOnly` (optional) - true/false

**Response:** `200 OK`

---

### 7.2 Mark as Read
Mark notification as read.

**Endpoint:** `PUT /api/notifications/:id/read`  
**Auth:** Required

---

### 7.3 Mark All as Read
Mark all notifications as read.

**Endpoint:** `PUT /api/notifications/read-all`  
**Auth:** Required

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

- **Authentication endpoints:** 5 requests per 15 minutes
- **OTP endpoints:** 3 requests per 15 minutes per phone
- **General API:** 100 requests per 15 minutes per IP

---

## WebSocket Events

Connect to WebSocket:
```javascript
const socket = io('wss://api.yourdomain.com', {
  auth: { token: 'your_jwt_token' }
});
```

### Events to Listen:
- `wallet:updated` - Wallet balance changed
- `listing:approved` - Your listing approved
- `listing:rejected` - Your listing rejected
- `payout:processing` - Payout being processed
- `notification:new` - New notification received

---

**Last Updated:** January 2024  
**Version:** 1.0.0
