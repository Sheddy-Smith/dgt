# Announcements & Notifications Admin Panel

## Overview
Comprehensive multi-channel notification management system for the DGT platform, supporting Push, SMS, Email, and In-App notifications.

## 📁 File Structure

```
admin_panel/src/
├── app/
│   └── announcements/
│       └── page.tsx                    # Main page with 6 tabs
└── components/
    └── announcements/
        ├── broadcasts-tab.tsx          # Manual campaign management
        ├── create-campaign-dialog.tsx  # Multi-step campaign creation wizard
        ├── campaign-drawer.tsx         # Campaign detail viewer
        ├── system-events-tab.tsx       # Transactional event configuration
        ├── templates-tab.tsx           # Message template library
        ├── audiences-tab.tsx           # Audience segment builder
        ├── delivery-logs-tab.tsx       # Delivery tracking & PII masking
        └── analytics-tab.tsx           # Performance analytics & KPIs
```

## 🎯 Features Implemented

### 1. Broadcasts Tab (Manual Campaigns)
- **Create Campaign Flow** (6-step wizard):
  1. Basics: Name, goal selection
  2. Channels: Multi-channel selection (Push/SMS/Email/In-App)
  3. Audience: Segment targeting, city/category filters
  4. Content: Title, body, CTA, deep links
  5. Localization: Multi-language variants
  6. Scheduling: Send now/schedule, throttling, quiet hours, frequency caps

- **Campaign Management**:
  - Table view with filters (channel, status, city, language)
  - Campaign status: draft, scheduled, active, paused, completed, failed
  - Actions: Pause, Resume, Duplicate, Edit, Archive
  - Real-time audience size estimation
  - Overlap warnings for multiple segments

- **Campaign Detail Drawer**:
  - Performance metrics by channel & city
  - Content preview
  - Targeting details
  - Schedule configuration

### 2. System Events Tab (Transactional)
- **15 Pre-configured Events**:
  - Auth: OTP sent/failed
  - Listings: submitted/approved/rejected/expiring/expired
  - Wallet: credit/debit/payout success/fail
  - KYC: pending/approved/rejected
  - Disputes: created/resolved
  - Security: password change, device login, account blocked

- **Event Configuration**:
  - Priority levels (high/medium/low)
  - Primary channel + fallback chain
  - Template binding
  - Rate limiting (per minute)
  - Retry policy (count + backoff)
  - Error handling: retry/fallback/drop

- **Category Tabs**: Organized by event type for easy navigation

### 3. Templates Tab (Content Library)
- **Template Types**: Transactional, Marketing, Safety, Legal
- **Multi-channel Support**: Push, SMS, Email, In-App
- **Variable System**: `{{variable_name}}` syntax with validation
- **Language Variants**: Multi-language support per template
- **Versioning**: v1, v2, v3... with rollback capability
- **Status Workflow**: draft → reviewed → approved

- **Validation Features**:
  - Undefined variable detection
  - SMS length check (160 chars)
  - Spam word detection
  - Link whitelist verification

- **Template Preview**: Full preview with all translations

### 4. Audiences Tab (Segment Builder)
- **Segment Rules**:
  - User Role: buyer/seller/both
  - Tenure: <7d, 7-30d, 30-90d, >90d
  - Cities: Multi-select
  - Categories: Multi-select
  - KYC Status: verified/pending/rejected/not-started
  - Activity: active/inactive-14d/inactive-30d/churn-risk
  - Risk Score: >70, etc.
  - Language: Multi-select

- **Real-time Features**:
  - Audience size estimation
  - Overlap detection with other segments
  - Refresh estimate button

- **Segment Management**:
  - Saved segments with ownership
  - Last used tracking
  - Edit/Delete/Refresh actions

### 5. Delivery Logs Tab
- **Comprehensive Logging**:
  - User info (name, phone, email)
  - Channel & template
  - Campaign association
  - Delivery timeline (sent → delivered → opened → clicked)
  - Provider details (FCM, Gupshup, SES, etc.)
  - Error codes & messages

- **PII Protection**:
  - Auto-masking of phone/email
  - Unmask with reason + audit trail
  - Masked format: +91-987****3210

- **Status Tracking**:
  - sent, delivered, opened, clicked, bounced, failed, blocked
  - Visual timeline in detail sheet

- **Filters**:
  - Channel, Status, Provider, Date Range
  - Export to CSV

- **Actions**:
  - Resend (for failed messages)
  - Suppress user (opt-out)

### 6. Analytics Tab
- **Top-level KPIs** (6 cards):
  - Total Sent, Delivery Rate, Open Rate, Click Rate
  - Avg. Delivery Time, Failure Rate
  - Trend indicators (up/down with %)

- **5 Sub-tabs**:

  **a) Channel Performance**:
  - Sent, Delivered, Opened, Clicked, Failed counts
  - Delivery rate, Open rate, Click rate percentages
  - Color-coded badges for performance tiers

  **b) Campaign Performance**:
  - Top campaigns ranked by engagement
  - Revenue attribution tracking
  - Conversion funnel visualization
  - ROI calculation

  **c) Segment Performance**:
  - Engagement metrics by audience segment
  - Open/Click/Conversion rates with progress bars
  - Segment comparison

  **d) A/B Tests**:
  - Side-by-side variant comparison
  - Statistical significance badge
  - Winner declaration
  - Metrics: sent, open rate, click rate

  **e) Transactional SLAs**:
  - OTP latency tracking (avg, P95)
  - Success/failure rates
  - SLA target vs actual
  - Pass/fail status
  - Compliance metrics (opt-out, DND, bounce rates)

## 🔗 Deep Links Supported
- `/listing/{id}` - View listing
- `/listing/{id}/renew` - Renew listing
- `/wallet` - Wallet page
- `/kyc` - KYC verification
- `/boost-plans` - Boost plans page
- Custom paths as needed

## 🔒 Security & Compliance
- **Role-based Access**:
  - Marketing: broadcasts, templates, segments
  - Support: transactional, resend
  - Moderator: safety alerts (limited)
  - Super Admin: all features + provider config
  - Analyst: analytics & exports only

- **PII Protection**:
  - Auto-masking of sensitive data
  - Unmask requires reason
  - Full audit trail (who/what/when/IP)

- **Compliance**:
  - Opt-in/opt-out flags per channel
  - DND list respect (SMS)
  - Unsubscribe footer (Email/SMS)
  - GDPR/DPDP compliance ready

## 📊 Mock Data Included
All tabs include realistic mock data for:
- 3 active campaigns (various statuses)
- 15 system events (across 6 categories)
- 8 message templates (4 types)
- 8 audience segments
- 8 delivery logs (various statuses)
- Complete analytics with 4 channels

## 🎨 UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Full theme compatibility
- **Loading States**: Skeleton screens ready
- **Error States**: Validation & error handling
- **Empty States**: Guidance when no data
- **Accessibility**: Semantic HTML, ARIA labels
- **Icons**: Lucide React icons throughout
- **Color Coding**: Consistent status colors
- **Badges**: Status, priority, channel indicators

## 🚀 Next Steps for Production

### Backend Integration
1. Connect to notification service API
2. Implement WebSocket for real-time updates
3. Add FCM/SMS/Email provider integrations
4. Set up template variable resolver
5. Implement segment query engine
6. Add delivery status webhooks

### Enhanced Features
1. **Campaign Scheduling**:
   - Recurring campaigns
   - Timezone-aware scheduling
   - Daylight savings handling

2. **Advanced Analytics**:
   - Custom date ranges
   - Export to PDF reports
   - Heatmaps (best send times)
   - User journey tracking

3. **A/B Testing**:
   - Auto-winner selection
   - Multi-variate testing
   - Traffic splitting controls

4. **Template Editor**:
   - Rich text editor
   - Image uploads
   - Preview on device frames
   - Test send functionality

5. **Automation**:
   - Drip campaigns
   - Trigger-based flows
   - Lifecycle campaigns
   - Win-back automation

### Performance Optimizations
- Pagination for large lists
- Virtual scrolling for logs
- Debounced search
- Cached audience size calculations
- Background job processing

### Monitoring
- Provider health dashboard
- Auto-failover configuration
- Alert on SLA breaches
- Cost tracking per channel

## 📖 Usage Examples

### Creating a Broadcast Campaign
1. Navigate to Announcements → Broadcasts tab
2. Click "Create Campaign"
3. Fill in 6-step wizard:
   - Name: "Renew Expiring Listings"
   - Goal: "renew listings"
   - Channels: Push + In-App
   - Audience: "Expiring in 3 days" segment
   - Content: Add title, body, CTA
   - Schedule: Send now or schedule

### Configuring a System Event
1. Go to System Events tab
2. Select category (e.g., "Listings")
3. Click Settings on "Listing Approved"
4. Configure:
   - Priority: Medium
   - Primary: Push → Fallback: In-App, Email
   - Template: listing_approved
   - Rate limit: 10/min
   - Error policy: Fallback

### Building an Audience Segment
1. Navigate to Audiences tab
2. Click "Create Segment"
3. Define rules:
   - Role: Seller
   - Tenure: <7d
   - Cities: Delhi, Mumbai
   - KYC: Verified
4. View estimated size
5. Save segment

## 🐛 Known Limitations (Mock Data)
- All data is static mock data
- No actual API calls
- No persistence (resets on refresh)
- Size estimates are calculated with simple formulas
- No actual notification sending

## 📝 Notes
- All components use TypeScript for type safety
- Follows shadcn/ui component patterns
- Consistent with existing admin panel design
- Ready for i18n (internationalization)
- Mobile-responsive layouts

---

**Created**: December 2025  
**Status**: ✅ Complete - Ready for backend integration
