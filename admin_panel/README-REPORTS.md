# Reports & Analytics Page

## Overview
The **Reports & Analytics** page is a comprehensive business intelligence dashboard for the DGT marketplace admin panel. It provides real-time insights into marketplace performance, user behavior, monetization, fraud detection, operational efficiency, and user retention.

## 📍 Navigation
- **Path**: `/reports`
- **Sidebar**: Dashboard → Reports & Analytics

## 🎯 Purpose
- Centralized marketplace performance monitoring
- Real-time dashboards for decision-making
- Role-based views for different teams (business, trust, ops, marketing, finance)
- Data-driven insights for growth and optimization

## 👥 Role-Based Access

| Role | Access |
|------|--------|
| **Super Admin** | All dashboards |
| **Analyst** | Full read access + exports |
| **Finance** | Monetization / Payouts only |
| **Moderator** | Fraud / Trust dashboards only |
| **Marketing** | User / Retention dashboards only |
| **Support** | SLA dashboard only |

## 🗂 Sub-Tabs (8 Dashboards)

### 1. **Marketplace Overview** 📊
**KPIs:**
- Active Listings
- New Listings Today
- Unique Sellers / Buyers
- GMV (Gross Merchandise Value)
- Transactions completed
- Average Time-to-Sell
- DAU / MAU
- Conversion rate (post → message → sale)

**Visualizations:**
- 📈 Listings Growth (daily trend line chart)
- 🌆 Top 10 Cities (by listings & sales)
- 🏷 Category Mix (pie/bar chart)
- 🕒 Average Listing Age before Sale
- 💬 Message Conversion Funnel
- 💰 Revenue Split: Boosts | Ads | Commissions | Others

---

### 2. **User Analytics** 👥
**KPIs:**
- New Users (buyers/sellers)
- Verified KYC users %
- Returning Users %
- Blocked/Flagged users count
- Churn rate %
- Avg listings per seller
- Power Sellers (active >10 listings)
- Reports per 100 users

**Visualizations:**
- Signup Trend (new vs returning)
- City Map Heat (active users per region)
- Funnel: Register → Post Listing → Get Message → Sale
- Cohort Analysis (D30/D60/D90 retention)
- Device split: Android / iOS / Web
- Rating Distribution

---

### 3. **Listing Insights** 📦
**KPIs:**
- Total Listings / Active / Expired / Pending
- Avg Price per Category
- Boosted listings %
- Reported listings count
- Avg Listing Lifetime
- Approval Rate %

**Visualizations:**
- Category-wise listing volume table
- Listing lifecycle funnel (Post → Approve → Expire)
- Expiry patterns (weekday trend)
- Boost performance graph (boost vs organic visibility)
- Listing Quality Score distribution
- Top sellers by listing count
- Price heatmap per category

**Drill-down:**
- Click category → detailed category dashboard

---

### 4. **Monetization Reports** 💰
**KPIs:**
- Total Revenue (today/week/month)
- Boost Plan Sales (₹ + count)
- Ad Campaign Revenue
- Wallet Top-ups
- Refund Amounts
- ARPU / ARPPU
- Payouts Completed (%)
- Platform Fees Collected

**Visualizations:**
- Revenue trend line (30-day view)
- Split by product (Boosts / Ads / Coupons)
- Refund rate trend
- Top spending sellers
- Payment method split (UPI / Bank / Card / Wallet)
- Payout volume trend
- Boost plan ROI (views → messages → conversions)

---

### 5. **Trust & Safety / Fraud** 🛡️
**KPIs:**
- Reports per 1k listings
- Auto-flag % (AI)
- Manual moderation rate
- Blocked users count
- Repeat offender %
- Refund due to fraud (₹)
- Scam phrase frequency
- AI flag accuracy

**Visualizations:**
- Reason breakdown (scam / fake / abuse / counterfeit)
- Fraud source (category / city / user type)
- Listing rejection causes
- AI flag vs manual flag accuracy
- Duplicate listing detection rate
- Device/IP clustering (multi-account map)
- Wallet freeze history

**Alerts:**
- 🔴 "Spike in Off-platform Payment Attempts"
- 🟡 "High Fraud Reports in Cars > ₹5L Segment"

**Drill Links:**
- → Users (Flagged)
- → Listings (Reported)
- → Chat Monitor

---

### 6. **Operational SLAs** ⚡
**KPIs:**
- Avg moderation time (post → decision)
- KYC turnaround time
- Dispute resolution time
- Refund issue time
- API uptime %
- OTP success rate %
- Message delivery latency

**Visualizations:**
- SLA compliance trend (per week)
- Moderator productivity (actions/day)
- Ticket volumes by reason
- Auto vs manual approvals ratio
- Queue backlog chart

**SLA Color Codes:**
- 🟢 On Target (<12h)
- 🟡 Warning (12–24h)
- 🔴 Breached (>24h)

---

### 7. **Retention & Engagement** 📈
**KPIs:**
- DAU, WAU, MAU
- Retention D30, D60, D90
- Session length (avg minutes)
- Notification CTR %
- Chat engagement (messages per listing)
- Boost renewal %
- Re-list % (after expiry)
- Returning sellers %
- Seller lifetime revenue (LTV)

**Visualizations:**
- Retention cohort (by signup month)
- DAU vs MAU (stickiness)
- Push open → renew conversion funnel
- App install → KYC completion
- Inactivity heatmap
- Churn reasons (survey or inferred)

---

### 8. **Custom Reports / Exports** 📄
**Features:**
- Query builder UI (select metrics, filters, group-by)
- Save report templates
- Schedule recurring export (email/Slack)
- Formats: CSV / Excel / JSON / PDF
- Access control (private / team)
- Export logs (who, when, filters used)
- API endpoint for external BI tools

**Example Templates:**
- "Weekly Category Performance"
- "Top Sellers by GMV"
- "Refund Summary by City"
- "Moderator Efficiency"
- "Daily Payout Report"

---

## 🎨 Global Features

### **Filters (Top Bar)**
- Date range picker
- City dropdown
- Category filter
- Platform (Web/App)
- Compare toggle: vs Last Week / Last Month / Last Year

### **Actions**
- 📥 Export: CSV / PDF / Excel
- 📧 Schedule: Daily / Weekly email reports
- 🔄 Auto-refresh toggle (every 60s)
- 📊 Download chart (SVG/PDF)

### **UX Enhancements**
- KPI cards with hover tooltips (% change explanation)
- "Drill to user/listing" for any metric
- Light/dark theme support
- Live "Alerts" bar (fraud spikes, downtime)
- Trendline colors: green (growth), red (decline)

---

## 🔗 Data Flow: Admin ↔ User App

| Data Flow | Direction | Description |
|-----------|-----------|-------------|
| Listing actions | App → Admin | Events stored for metrics |
| Wallet/Payout | App ↔ Admin | Sync with payment APIs |
| Notifications | Admin ↔ App | CTR/open rates tracked |
| Fraud flags | App → Admin | AI events enrich Trust dashboard |
| Chat activity | App → Admin | Message volume → engagement graphs |
| KYC | App → Admin | Time to verify logged for SLA |

**Real-time:**
- WebSocket/streaming analytics for dashboard auto-refresh
- Batch jobs nightly for heavy aggregates
- OLAP/warehouse backend (BigQuery, ClickHouse, etc.)

---

## 🔒 Security & Governance

- ✅ Role-based view access (Finance sees only revenue)
- ✅ Sensitive data masked by default
- ✅ Audit trail of report exports
- ✅ Aggregation limits (no raw PII exposure)
- ✅ Encryption in storage & transit
- ✅ Data retention: raw logs 90d, aggregates 2y
- ✅ GDPR/DPDP compliant data masking

---

## 📁 File Structure

```
admin_panel/src/
├── app/
│   └── reports/
│       └── page.tsx                    # Main reports page
├── components/
│   ├── reports/
│   │   ├── marketplace-overview.tsx    # Dashboard 1
│   │   ├── user-analytics.tsx          # Dashboard 2
│   │   ├── listing-insights.tsx        # Dashboard 3
│   │   ├── monetization-reports.tsx    # Dashboard 4
│   │   ├── trust-safety.tsx            # Dashboard 5
│   │   ├── operational-slas.tsx        # Dashboard 6
│   │   ├── retention-engagement.tsx    # Dashboard 7
│   │   └── custom-reports.tsx          # Dashboard 8
│   └── ui/
│       └── date-range-picker.tsx       # Date picker component
```

---

## 🚀 Future Enhancements (Optional)

1. **AI Forecasting**: Predict listings/revenue trend next 7 days
2. **Anomaly Detection**: Fraud spike auto-alert
3. **"What-if" Simulator**: Adjust boost price → impact projection
4. **Automated Slack/Email Digest**: Daily summary
5. **Drill to Raw Event Logs**: Debug mode for technical teams

---

## 📊 Chart Integration (To Be Added)

Currently, chart placeholders are shown. Integrate with:
- **Recharts** (React charting library)
- **Chart.js** (flexible charting)
- **D3.js** (advanced visualizations)
- **Leaflet / Google Maps** (for city heatmaps)

Example:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
```

---

## 🎯 Key Metrics Summary

| Area | Data Source | Key Use |
|------|-------------|---------|
| Marketplace | Listings + Users | Growth, supply-demand |
| Monetization | Wallet + Payments | Revenue tracking |
| Safety | Reports + Flags | Fraud prevention |
| SLA | API logs + Tickets | Ops optimization |
| Retention | App activity | Growth strategy |
| Custom | Aggregator | Custom BI insights |

---

## 💡 Usage Tips

1. **For Executives**: Focus on "Marketplace Overview" for high-level metrics
2. **For Finance**: Use "Monetization Reports" for revenue analysis
3. **For Trust Team**: Monitor "Trust & Safety" for fraud patterns
4. **For Marketing**: Track "User Analytics" and "Retention" for campaign performance
5. **For Support**: Check "Operational SLAs" for team efficiency

---

## 🐛 Known Limitations

- Charts are currently placeholders (need charting library integration)
- Mock data is used for demonstration
- Real-time data streaming not yet implemented
- API endpoints need to be connected to actual backend

---

## 📞 Support

For questions or issues, contact:
- **Tech Team**: tech@dgt.com
- **Analytics Team**: analytics@dgt.com
