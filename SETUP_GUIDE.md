# A2Z Bakerie — Setup Guide

This guide covers everything needed to get the new Next.js site live on Vercel.

---

## What's Already Done

- Next.js app built with homepage, admin dashboard, subscriptions, and merch store
- Supabase tables created (admin_users, orders, subscription_clubs, subscription_signups, merch_orders)
- Admin user created for Ann (achristinez90@gmail.com / A2zbakerie26!)
- Vercel project linked
- Git repo connected

---

## What Needs to Be Filled In

### 1. Supabase Keys (`.env.local` and Vercel)

Go to: https://supabase.com/dashboard/project/mtikaozamvbnxoxhzdca/settings/api-keys

**Already set:**
```
NEXT_PUBLIC_SUPABASE_URL=https://mtikaozamvbnxoxhzdca.supabase.co
```

**Need to copy from Supabase > Settings > API Keys:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # "Publishable key" (or legacy "anon" key)
SUPABASE_SERVICE_ROLE_KEY=        # "Secret key" (or legacy "service_role" key — click Reveal)
```

### 2. JWT Secret

Generate a random secret for admin auth:
```bash
openssl rand -base64 48
```
Set it as:
```
JWT_SECRET=<paste the random string>
```

### 3. Printful API Key

Go to: https://www.printful.com/dashboard/developer/api-keys
- Log in with Ann's Printful account (achristinez90@gmail.com)
- Create a new API key (or use existing)
- Set it as:
```
PRINTFUL_API_KEY=<paste key>
```

### 4. Stripe Keys (for merch checkout — can add later)

Go to: https://dashboard.stripe.com/apikeys
- Create a Stripe account for A2Z Bakerie (or use existing)
```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## How to Set Environment Variables

### Local Development
Edit `/Users/henryschertzinger/Desktop/a2z-baker/.env.local` and fill in the values.

### Vercel (Production)
Go to: https://vercel.com/henry-5260s-projects/a2z-baker-site/settings/environment-variables

Add each variable there. They'll be available on the next deploy.

---

## How to Deploy

```bash
cd /Users/henryschertzinger/Desktop/a2z-baker
git add -A
git commit -m "Upgrade to Next.js with admin dashboard, subscriptions, and merch store"
git push origin main
```

Vercel will auto-deploy from the GitHub push.

---

## Admin Dashboard

- URL: https://a2zbakerie.com/admin
- Login: achristinez90@gmail.com / A2zbakerie26!
- Features:
  - **Dashboard** — Overview with order/review stats
  - **Orders** — View and manage all customer orders (status, notes)
  - **Reviews** — Moderate customer reviews (delete spam)
  - **Subscriptions** — Create/edit subscription clubs (Muffin Club, etc.), view signups

---

## Public Pages

- `/` — Homepage (identical to current live site)
- `/subscriptions` — Browse and sign up for subscription clubs
- `/shop` — Merch store (Printful products)
- `/shop/[id]` — Product detail
- `/shop/checkout` — Checkout

---

## For Ann: Quick Start

1. **Log into admin**: Go to a2zbakerie.com/admin, sign in with your email/password
2. **Create a subscription club**: Go to Subscriptions > New Club (e.g., "Muffin of the Month", $24/month)
3. **Share the link**: Customers can sign up at a2zbakerie.com/subscriptions
4. **Manage orders**: Check the Orders tab for new order form submissions
5. **Merch**: Once Printful products are set up, they'll appear at a2zbakerie.com/shop
