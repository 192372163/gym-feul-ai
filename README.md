# FitFuel AI - Backend

AI-powered workout & diet plan generator.

## Stack
- **Express** (Node.js) - REST API
- **Firebase Auth** - user authentication (clients send Firebase ID token in `Authorization: Bearer <token>`)
- **Supabase** - Postgres database (profiles, plans)
- **Cloudinary** - progress photo uploads
- **Razorpay** - subscription/payments
- **Grok API** (x.ai) - generates personalized workout & diet plans

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in credentials:
   - Firebase: project settings -> Service accounts -> Generate new private key
   - Supabase: project settings -> API (use service_role key on backend only)
   - Cloudinary: dashboard -> Account details
   - Razorpay: dashboard -> API Keys
   - Groq: console.groq.com -> API keys
3. Run `supabase/schema.sql` in your Supabase project's SQL editor.
4. `npm run dev`

## API Endpoints
All endpoints require `Authorization: Bearer <Firebase ID token>`.

| Method | Path | Description |
|---|---|---|
| GET | /health | Health check (no auth) |
| GET | /api/profile | Get user profile |
| PUT | /api/profile | Create/update profile |
| POST | /api/plans/generate | Generate AI workout+diet plan from profile |
| GET | /api/plans/latest | Get most recent plan |
| GET | /api/plans | Get plan history |
| POST | /api/uploads/progress-photo | Upload progress photo to Cloudinary |
| POST | /api/payments/order | Create Razorpay order |
| POST | /api/payments/verify | Verify Razorpay payment, activate subscription (body: order_id, payment_id, signature, planType) |
| GET | /api/subscription | Get current subscription status |
| POST | /api/logs/workout | Log a completed workout exercise |
| GET | /api/logs/workout | Get workout log history |
| POST | /api/logs/meal | Log a meal |
| GET | /api/logs/meal?date=YYYY-MM-DD | Get meal logs (optionally by date) |
| POST | /api/logs/water | Log water intake (body: amountMl) |
| GET | /api/logs/water?date=YYYY-MM-DD | Get water logs + total for the day |
| POST | /api/logs/weight | Log body weight |
| GET | /api/logs/weight | Get weight log history |
