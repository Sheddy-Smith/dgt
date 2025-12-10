# Announcements & Notifications - Quick Reference

## 🎯 Key Features at a Glance

### Multi-Channel Support
- **Push Notifications** (FCM) - Bell icon 🔔
- **SMS** (Gupshup/Twilio) - Message icon 💬  
- **Email** (SES/SendGrid) - Mail icon ✉️
- **In-App Inbox** - Smartphone icon 📱

### Campaign Types
- **Manual Broadcasts** - Marketing campaigns, promotions
- **Transactional Events** - Auto-triggered system notifications
- **Scheduled Campaigns** - Time-based delivery
- **A/B Tests** - Variant testing for optimization

### Smart Targeting
- User roles (Buyer/Seller)
- Location (Cities)
- Categories (Mobiles, Electronics, etc.)
- KYC status
- Activity levels
- Custom segments

---

## 📍 Navigation

```
Dashboard → Announcements & Notifications
├── Broadcasts        (Manual campaigns)
├── System Events     (Auto-triggered)
├── Templates         (Message library)
├── Audiences         (User segments)
├── Delivery Logs     (Tracking & errors)
└── Analytics         (Performance metrics)
```

---

## 🚀 Common Workflows

### 1️⃣ Send a Renewal Reminder
```
Broadcasts → Create Campaign
→ Name: "Listing Expiring Soon"
→ Channels: Push + In-App
→ Audience: "Expiring in 3 days" segment
→ Content: "Your listing expires in 3 days! Renew now."
→ CTA: "Renew Now" → /renew
→ Schedule: Send now
→ Publish ✅
```

### 2️⃣ Configure OTP Notifications
```
System Events → Auth category
→ Select "OTP Sent"
→ Settings:
   - Priority: High
   - Primary: SMS
   - Fallback: In-App
   - Template: otp_send
   - Rate limit: 1/min
   - Retries: 3
→ Save ✅
```

### 3️⃣ Create Message Template
```
Templates → Create Template
→ Key: listing_approved
→ Type: Transactional
→ Channel: Push
→ Title: "Your listing is live! 🎉"
→ Body: "Great news! Your listing {{listing_title}} is now live."
→ Variables: listing_title, listing_id
→ Languages: EN, HI
→ Save as Draft
→ Submit for Review ✅
```

### 4️⃣ Build Audience Segment
```
Audiences → Create Segment
→ Name: "Power Sellers - Delhi"
→ Rules:
   - Role: Seller
   - KYC: Verified
   - City: Delhi
   - Listings: >10 active
→ Estimated size: ~892 users
→ Save ✅
```

### 5️⃣ Track Delivery Issues
```
Delivery Logs → Filters
→ Status: Failed or Bounced
→ Channel: SMS
→ Provider: Gupshup
→ View error codes (DND, Invalid number, etc.)
→ Resend or Suppress user ✅
```

### 6️⃣ Analyze Campaign Performance
```
Analytics → Campaign Performance
→ Select campaign
→ View metrics:
   - Open rate: 68.5%
   - Click rate: 24.3%
   - Conversions: 203
   - Revenue: ₹1,52,250
→ Export report ✅
```

---

## 🎨 Status Color Codes

### Campaign Status
- 🟢 **Active** - Currently sending
- 🟡 **Scheduled** - Waiting to send
- 🔵 **Completed** - Finished successfully
- ⚫ **Draft** - Not published yet
- 🟠 **Paused** - Temporarily stopped
- 🔴 **Failed** - Sending failed

### Delivery Status
- 🟢 **Clicked** - User engaged fully
- 🟣 **Opened** - User viewed message
- 🔵 **Delivered** - Reached user's device
- ⚫ **Sent** - Handed to provider
- 🟡 **Bounced** - Temporary failure
- 🔴 **Failed** - Permanent failure
- 🔴 **Blocked** - User opted out

### Template Status
- 🟢 **Approved** - Production-ready
- 🔵 **Reviewed** - Pending approval
- ⚫ **Draft** - Work in progress

---

## 📊 Key Metrics Explained

### Delivery Rate
```
(Delivered / Sent) × 100
Target: >95%
```

### Open Rate
```
(Opened / Delivered) × 100
Good: >50% (Push), >30% (Email)
```

### Click Rate (CTR)
```
(Clicked / Opened) × 100
Good: >15% (Push), >5% (Email)
```

### Conversion Rate
```
(Conversions / Clicked) × 100
Target: >2%
```

### Bounce Rate
```
(Bounced / Sent) × 100
Warning if: >5%
```

---

## 🔒 Role Permissions

| Feature | Marketing | Support | Moderator | Super Admin | Analyst |
|---------|-----------|---------|-----------|-------------|---------|
| Create Broadcasts | ✅ | ❌ | ❌ | ✅ | ❌ |
| Transactional Events | ❌ | ✅ | ❌ | ✅ | ❌ |
| Templates | ✅ | ❌ | ❌ | ✅ | ❌ |
| Audiences | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delivery Logs | ✅ | ✅ | ❌ | ✅ | ✅ |
| Analytics | ✅ | ✅ | ❌ | ✅ | ✅ |
| Safety Alerts | ❌ | ❌ | ✅ | ✅ | ❌ |
| Provider Config | ❌ | ❌ | ❌ | ✅ | ❌ |
| Unmask PII | ❌ | ✅ | ❌ | ✅ | ❌ |

---

## 🛡️ Best Practices

### ✅ Do's
- ✅ Test campaigns with small segments first
- ✅ Use frequency caps to avoid spam
- ✅ Respect quiet hours (22:00-08:00)
- ✅ Validate templates before publishing
- ✅ Monitor delivery rates daily
- ✅ Set up fallback channels for critical events
- ✅ Use A/B testing for optimization
- ✅ Document reason when unmasking PII

### ❌ Don'ts
- ❌ Send campaigns without audience verification
- ❌ Use spam words ("FREE", "WINNER", etc.)
- ❌ Ignore DND lists (SMS)
- ❌ Send too many messages per day (>3)
- ❌ Use generic CTAs ("Click here")
- ❌ Publish templates without review
- ❌ Override quiet hours for marketing
- ❌ Unmask PII without justification

---

## 🔧 Troubleshooting

### Campaign not sending?
1. Check status (must be "Active" or "Scheduled")
2. Verify audience size > 0
3. Check quiet hours settings
4. Ensure frequency cap not exceeded
5. Review delivery logs for errors

### Low open rates?
1. Test different subject lines (A/B test)
2. Optimize send time (check analytics)
3. Improve audience targeting
4. Add emojis to title (test first)
5. Ensure content is relevant

### SMS failures?
1. Check DND list compliance
2. Verify phone number format
3. Review provider limits
4. Check account balance
5. Switch to fallback provider

### Template validation errors?
1. Check for undeclared variables
2. Verify SMS length (<160 chars)
3. Remove spam words
4. Whitelist external links
5. Add all required language variants

---

## 📞 Support Contacts

- **Technical Issues**: tech-support@dgt.com
- **Campaign Strategy**: marketing@dgt.com
- **Compliance Questions**: compliance@dgt.com
- **Provider Issues**: provider-ops@dgt.com

---

## 🔗 Related Documentation

- [API Documentation](./API_DOCS.md)
- [Provider Setup Guide](./PROVIDER_SETUP.md)
- [Template Variables Reference](./TEMPLATE_VARS.md)
- [Deep Linking Guide](./DEEP_LINKS.md)

---

**Last Updated**: December 2025  
**Version**: 1.0
