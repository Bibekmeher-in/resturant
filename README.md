# The Ember Table

The Ember Table is a restaurant online-ordering and order-management application built for the Tenacious Techies Private Limited Next.js Developer Technical Assessment.

## Features

**Customer**

- Menu browsing, search, and category filtering
- Persistent cart
- Validated checkout and order placement
- Order confirmation

**Admin**

- Admin login
- Order list and status filtering
- Order details and status updates

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- React Hook Form
- Zod

## Architecture

The App Router in `src/app` contains pages and API Route Handlers. Handlers use shared services and a mock data layer in `src/lib` and `src/data`. The Zustand store manages the persistent cart. Reusable components are grouped by feature under `src/components`. Server Components are the default; Client Components are used for browser state, forms, and interactive controls.

## Folder Structure

```text
src/
  app/          Routes, layouts, and API Route Handlers
  components/   Reusable feature-based UI
  data/         Mock menu and order data
  lib/          API services, auth, validation, and calculations
  store/        Zustand cart store
  types/        Shared TypeScript models
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/menu` | Get menu items |
| GET | `/api/menu?category=...` | Filter menu by category |
| GET | `/api/menu?search=...` | Search menu items |
| POST | `/api/orders` | Create an order; public for checkout |
| GET | `/api/order-confirmations/[id]` | Get a public order receipt |
| GET | `/api/orders` | List orders; admin session required |
| GET | `/api/orders/[id]` | Get order details; admin session required |
| PATCH | `/api/orders/[id]` | Update order status; admin session required |
| POST | `/api/admin/login` | Sign in as admin |
| POST | `/api/admin/logout` | Sign out |

Order creation accepts menu item IDs and quantities. The server looks up current menu data and calculates item prices and totals.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and replace the placeholders with private values. Never commit real credentials.

```dotenv
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
AUTH_SECRET=replace-with-at-least-32-random-characters
```

`AUTH_SECRET` must contain at least 32 characters.

## Local Setup

Requires Node.js 22.x and npm.

```bash
npm ci
npm run dev
```

Admin login: [`/admin/login`](http://localhost:3000/admin/login)

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel Deployment

1. Import the repository into Vercel.
2. Set the project Node.js version to 22.x.
3. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` as private environment variables.
4. Deploy.

No custom `vercel.json` is required.

## Persistence Limitation

The menu uses mock data. Orders are stored in process memory, so they are not durable across restarts or shared across instances. This is suitable for the assessment demo; production use requires durable storage.

## Known Limitations

- Mock menu data
- In-memory order storage
- No payment gateway
- No real-time order updates
- No automated test suite
