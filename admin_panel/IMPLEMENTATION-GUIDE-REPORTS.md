# Reports & Analytics - Implementation Guide

## ✅ What's Been Created

### 📁 Main Page
- **Path**: `admin_panel/src/app/reports/page.tsx`
- **Features**: 
  - Role-based tab visibility
  - Global filters (date, city, category, platform)
  - Auto-refresh toggle
  - Export and scheduling buttons
  - 8 sub-tab navigation

### 📊 Dashboard Components (8 Total)

1. **`marketplace-overview.tsx`**
   - KPI cards: Active Listings, GMV, Transactions, etc.
   - Top cities by sales
   - Category mix breakdown
   - Revenue split visualization
   - Message conversion funnel

2. **`user-analytics.tsx`**
   - User growth metrics
   - KYC verification rates
   - Device platform split (Android/iOS/Web)
   - Cohort retention analysis
   - Rating distribution
   - User funnel visualization

3. **`listing-insights.tsx`**
   - Listing lifecycle tracking
   - Category-wise volume table
   - Boost vs organic performance
   - Top sellers leaderboard
   - Quality score distribution
   - Price analysis

4. **`monetization-reports.tsx`**
   - Revenue breakdown by product
   - Boost plan ROI tracking
   - Payment method analysis
   - Top spenders table
   - Refund and payout trends
   - Platform fees summary

5. **`trust-safety.tsx`**
   - Active fraud alerts
   - Report reason breakdown
   - AI vs manual moderation stats
   - Duplicate detection metrics
   - Multi-account detection
   - Wallet freeze tracking

6. **`operational-slas.tsx`**
   - SLA compliance tracking (color-coded)
   - Moderator productivity stats
   - Ticket volume analysis
   - Auto vs manual approval ratio
   - Queue backlog monitoring
   - System health metrics

7. **`retention-engagement.tsx`**
   - DAU/WAU/MAU tracking
   - Stickiness ratio (DAU/MAU)
   - Cohort retention tables
   - App install funnel
   - Churn reason analysis
   - User segment LTV

8. **`custom-reports.tsx`**
   - Query builder interface
   - Saved templates management
   - Report scheduling
   - Export logs table
   - Access control info
   - API endpoint documentation

### 🧩 UI Components
- **`date-range-picker.tsx`**: Date selection component

### 📖 Documentation
- **`README-REPORTS.md`**: Comprehensive documentation

---

## 🔧 Next Steps for Production

### 1. **Install Charting Library**
```bash
npm install recharts
# or
npm install chart.js react-chartjs-2
```

### 2. **Replace Chart Placeholders**
Current placeholders need to be replaced with actual charts:
```tsx
// Example with Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="listings" stroke="#8884d8" />
</LineChart>
```

### 3. **Connect to Backend APIs**
Replace mock data with actual API calls:
```tsx
// Example
const { data, isLoading } = useQuery({
  queryKey: ['marketplace-overview', filters],
  queryFn: () => fetch('/api/reports/marketplace-overview', {
    method: 'POST',
    body: JSON.stringify(filters)
  }).then(res => res.json())
})
```

### 4. **Add Real-time Updates**
Implement WebSocket or polling for live data:
```tsx
useEffect(() => {
  if (autoRefresh) {
    const interval = setInterval(() => {
      refetch()
    }, 60000) // 60 seconds
    return () => clearInterval(interval)
  }
}, [autoRefresh])
```

### 5. **Implement Export Functionality**
```tsx
const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
  const response = await fetch('/api/reports/export', {
    method: 'POST',
    body: JSON.stringify({ format, filters, reportType })
  })
  const blob = await response.blob()
  // Download file
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report-${Date.now()}.${format}`
  a.click()
}
```

### 6. **Add Authentication & Authorization**
```tsx
// In page.tsx
const { user } = useAuth()
const userRole = user.role // 'Super Admin' | 'Analyst' | etc.

// Filter tabs based on role
const getRoleBasedTabs = () => {
  // ... existing logic
}
```

### 7. **Implement Drill-down Navigation**
```tsx
// Example: Click on a city to see city-specific data
<div onClick={() => router.push(`/reports/city/${city.id}`)}>
  {city.name}
</div>
```

### 8. **Add Error Handling**
```tsx
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
```

---

## 🎨 Customization Options

### Change KPI Card Colors
```tsx
<Card className="border-l-4 border-l-blue-500">
  {/* Content */}
</Card>
```

### Add More Filters
```tsx
// In page.tsx filters section
<Select>
  <SelectTrigger>
    <SelectValue placeholder="User Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Users</SelectItem>
    <SelectItem value="buyer">Buyers</SelectItem>
    <SelectItem value="seller">Sellers</SelectItem>
  </SelectContent>
</Select>
```

### Customize Alert Thresholds
```tsx
const alerts = data.filter(item => 
  item.type === 'fraud' && item.count > FRAUD_THRESHOLD
)
```

---

## 🧪 Testing Checklist

- [ ] All 8 tabs load correctly
- [ ] Role-based access works
- [ ] Filters apply to all dashboards
- [ ] KPI cards show correct data
- [ ] Export buttons trigger downloads
- [ ] Auto-refresh updates data
- [ ] Responsive design on mobile
- [ ] Dark mode compatibility
- [ ] All tooltips display properly
- [ ] Drill-down links work

---

## 📊 Sample API Response Formats

### Marketplace Overview
```json
{
  "kpis": {
    "activeListings": 12453,
    "newListingsToday": 234,
    "uniqueSellers": 5678,
    "gmv": 4520000
  },
  "topCities": [
    { "name": "Mumbai", "listings": 3245, "sales": 892, "gmv": 1240000 }
  ],
  "categoryMix": [
    { "name": "Cars", "percentage": 28 }
  ]
}
```

### User Analytics
```json
{
  "kpis": {
    "newUsers": 1234,
    "kycVerified": 67.8,
    "churnRate": 8.2
  },
  "cohortData": [
    { "month": "Oct 2024", "d30": 45, "d60": 32, "d90": 28 }
  ]
}
```

---

## 🚀 Performance Optimization

1. **Lazy Load Charts**: Only render visible charts
2. **Paginate Tables**: Don't load all data at once
3. **Cache API Responses**: Use React Query or SWR
4. **Debounce Filter Changes**: Wait 500ms before applying
5. **Use Virtual Scrolling**: For large data tables

---

## 📱 Mobile Responsiveness

Current implementation uses:
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Responsive tabs: Grid layout adjusts to screen size
- Overflow scroll: Tables scroll horizontally on mobile

---

## 🔐 Security Considerations

- ✅ Role-based access implemented
- ⚠️ Need to add: API endpoint authentication
- ⚠️ Need to add: Rate limiting for exports
- ⚠️ Need to add: Data masking for PII
- ⚠️ Need to add: Audit logging for sensitive actions

---

## 📞 Support & Maintenance

- Update mock data with real metrics weekly
- Monitor chart rendering performance
- Add new KPIs as business needs evolve
- Regular security audits
- User feedback collection

---

## 🎯 Success Metrics

Track these to measure dashboard success:
- Daily active users of dashboard
- Most viewed reports
- Export frequency
- Time spent per dashboard
- User satisfaction score

---

**Created**: December 10, 2024
**Version**: 1.0
**Status**: Ready for Backend Integration
