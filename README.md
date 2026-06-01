# Personal Finance Calculator

A password-protected personal dashboard for tracking daily expenses and monthly fixed costs. Built with Next.js 14, TypeScript, and Tailwind CSS. All data is stored locally in the browser — nothing leaves your device.

**Live demo:** https://personal-finance-calculator-five.vercel.app

---

## Features

### Spending Tracker
- Log expenses with amount, category, description, and date
- Today's spending summary broken down by category
- Monthly total with a per-category progress bar chart
- Full transaction history sorted by date with one-click delete
- Categories: Food & Dining, Transport, Shopping, Entertainment, Other

### Subscriptions & Fixed Costs
- Track recurring monthly charges with billing date and category
- Subscriptions grouped by category with subtotals
- Monthly total and annual equivalent at a glance
- Categories: Housing, Utilities, Streaming, Software, Insurance, Health, Other

### Auth & Privacy
- Password-protected login — access is blocked without authentication
- 30-day session cookie (httpOnly, secure) — no repeated logins
- All spending data lives in browser localStorage only — no database, no server storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Auth | Next.js Middleware + httpOnly cookie |
| Storage | Browser localStorage |
| Deployment | Vercel |

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/johnl9152/personal-finance-calculator.git
cd personal-finance-calculator

# Install dependencies
npm install

# Create a local env file
cp .env.example .env.local
# Fill in DASHBOARD_PASSWORD and AUTH_SECRET in .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The login page will return a 500 error if the env vars are missing. Make sure `.env.local` is populated before starting the dev server.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# The password shown on the login page
DASHBOARD_PASSWORD=your_password_here

# A long random secret used as the session cookie value
# Generate one with: openssl rand -hex 32
AUTH_SECRET=your_secret_here
```

For production, set these in your Vercel project's environment variable settings.

---

## Project Structure

```
├── app/
│   ├── api/auth/       # POST (login) and DELETE (logout) endpoints
│   ├── components/     # NavBar with Sign out button
│   ├── lib/            # localStorage helpers and shared types
│   ├── login/          # Login page
│   ├── subscriptions/  # Fixed costs & subscriptions page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx        # Main spending dashboard
├── middleware.ts        # Route protection — redirects to /login if unauthenticated
├── next.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

---

## Deployment

The app is deployed on Vercel. To redeploy after changes:

```bash
vercel --prod
```

Set `DASHBOARD_PASSWORD` and `AUTH_SECRET` in your Vercel project's environment variable settings before the first deploy.

---

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- Scaffolded with [Claude Code](https://claude.ai/code)
