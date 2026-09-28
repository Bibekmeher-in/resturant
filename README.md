# The Ember Table

A restaurant online ordering and order management application built for the
Tenacious Techies Private Limited Next.js Developer Technical Assessment.
Customers can browse a mock menu, maintain a persistent cart, place an order,
and view its confirmation. The admin interface lists orders, filters by
status, shows order details, and updates status.

## Features

- Responsive restaurant menu with search, category filters, availability, and
  loading, empty, and error states.
- Zustand shopping cart with quantity controls and browser localStorage
  persistence.
- Checkout with React Hook Form and Zod validation for customer and delivery
  details.
- Order creation through a Route Handler. The server looks up current menu
  data and calculates prices and totals; browser-supplied prices are not used.
- Order confirmation page with customer details, itemized totals, current
  status, and retry/error handling.
- Admin sign-in using environment-configured credentials and a signed
  HTTP-only session cookie.
- Protected admin order list, status filters, order details, status updates,
  and sign-out.

## Technology stack

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- Tailwind CSS 4
- Zustand 5 for cart state
- React Hook Form and Zod for checkout form validation
- Node.js cryptography for signed admin sessions and timing-safe credential
  comparison

## Architecture

The application uses the App Router under `src/app`. Route pages, layouts,
metadata, and the admin dashboard redirect are Server Components by default.
Interactive behavior is isolated in client components:

- `MenuPage` is a Client Component because it manages search/filter state,
  debounces input, requests filtered menu data, and adds available items to the
  cart.
- `CheckoutPage` is a Client Component for React Hook Form, client validation,
  cart state, submission feedback, and navigation after a successful request.
- `OrderConfirmation` fetches a minimal public receipt from
  `GET /api/order-confirmations/[id]` in the browser and provides loading,
  retry, and not-found states. It omits customer contact and delivery data;
  the full order detail endpoint remains admin-only. Keeping this lookup on
  the API path avoids relying on a separate server module instance for the
  in-memory mock store.
- `OrderManagement` and its detail/status controls are Client Components for
  interactive filtering, selection, and status updates.
- `AdminLoginForm` and `AdminLogoutButton` are Client Components for form
  submission, loading/error feedback, and sign-out navigation. Credentials are
  checked only by server-side Route Handlers.
- `CartHydration` is a small Client Component that rehydrates the persisted
  Zustand cart after mount. This keeps the server and initial client render
  consistent; cart-dependent actions wait until hydration completes.

Route Handlers in `src/app/api` delegate to shared API services in
`src/lib/api`. `src/lib/data-access.ts` provides access to the mock menu and
order datasets in `src/data`. Types are centralized in `src/types`; shared
calculations, formatting, and validation are in `src/lib`.

### Folder structure

```text
src/
  app/
    admin/
      login/page.tsx
      dashboard/page.tsx
      orders/page.tsx
      orders/loading.tsx
    api/
      admin/login/route.ts
      admin/logout/route.ts
      order-confirmations/[id]/route.ts
      menu/route.ts
      orders/route.ts
      orders/[id]/route.ts
    checkout/page.tsx
    order-success/[orderId]/
      page.tsx
      loading.tsx
      error.tsx
      not-found.tsx
    globals.css
    icon.svg
    layout.tsx
    page.tsx
  components/
    admin/          # Order list, details, status and states
    cart/           # Cart controls, drawer, summary and hydration
    checkout/       # Checkout form and empty/loading UI
    layout/         # App shell and restaurant header
    menu/           # Menu, search, filters and loading/error UI
    order-success/  # Confirmation UI and loading state
    ui/             # Shared order status badge
  data/
    menu-items.ts
    orders.ts
    restaurant.ts
  lib/
    auth/           # Server-side admin credential and session helpers
    api/            # HTTP clients, route services and guards
    calculations/   # Shared subtotal, tax and currency helpers
    formatters/
    validations/    # Checkout schema
    constants.ts
    data-access.ts
  store/cart-store.ts
  types/            # Menu, cart and order models
  proxy.ts          # Early admin page and API protection
```

## API endpoints

Successful responses use a `{ "success": true, "data": ... }` envelope.
Errors return a user-safe message and an appropriate HTTP status.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/menu` | Return all menu items. |
| `GET` | `/api/menu?category=Pizza&search=margherita` | Filter by category and search term; filters can be combined. |
| `GET` | `/api/orders` | List mock orders for the admin interface. |
| `GET` | `/api/orders?status=Pending` | Filter orders by a supported status. |
| `POST` | `/api/orders` | Validate customer/cart input and create an order. |
| `GET` | `/api/orders/[id]` | Retrieve full order details for the admin interface (admin session required). |
| `PATCH` | `/api/orders/[id]` | Update an order to a supported status. |
| `GET` | `/api/order-confirmations/[id]` | Return a public receipt without customer contact or address data. |
| `POST` | `/api/admin/login` | Verify configured admin credentials and issue a session cookie. |
| `POST` | `/api/admin/logout` | Clear the admin session cookie. |

Order-list, admin order-detail, and status-update endpoints require a valid
admin session and return HTTP 401 with a safe JSON error otherwise. Customer
menu, checkout, order creation, and receipt display remain public. The receipt
endpoint returns only order ID, items, status, totals, and creation time; it
does not include customer contact information or delivery address. Order IDs
contain a cryptographically random UUID suffix, but should still be treated as
unguessable receipt references.

Order creation accepts customer information and item IDs/quantities, for
example:

```json
{
  "customerName": "Ananya Rao",
  "mobile": "9876543210",
  "email": "ananya@example.com",
  "address": "12 Example Street, Bengaluru 560001",
  "items": [{ "menuItemId": 1, "quantity": 2 }]
}
```

The client does not submit trusted item names, prices, tax, or totals. The
server validates the item IDs and quantities, looks up current available menu
items, and reconstructs the order.

## Data model

The main TypeScript models are in `src/types`:

- `MenuItem`: ID, name, description, category, price, image URL, and
  availability.
- `CartItem`: menu item ID, display snapshot (name, price, image), and
  quantity. The server does not trust the snapshot when creating an order.
- `Order`: ID, customer/contact/delivery details, itemized menu snapshot,
  status, subtotal, tax, total, and ISO creation timestamp.
- `OrderStatus`: `Pending`, `Accepted`, `Preparing`, or `Completed`.

## Cart persistence and tax assumption

Zustand persists cart items to the browser's `localStorage` under
`ember-table-cart`. Rehydration is deferred until after the first client render
to avoid a server/client markup mismatch. Invalid persisted entries are
discarded. Cart values improve the customer experience but are not an
authoritative source for order prices.

Tax is a mock flat **5%** of subtotal, defined once as `TAX_RATE` in
`src/lib/constants.ts`. Tax is rounded to two decimal places by
`src/lib/calculations/order-totals.ts`. This is an assessment assumption, not
tax advice or a production tax implementation.

## Local setup

Use Node.js **20.9.0 or later** (required by the installed Next.js version)
and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The customer menu is at
`/`; the admin order list is at `/admin/orders`. `/admin/dashboard` is a
convenience redirect to `/admin/orders`.

Copy `.env.example` to `.env.local` and replace its placeholders with private
values:

```text
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-strong-admin-password
AUTH_SECRET=your-random-secret-of-at-least-32-characters
```

Generate a strong session secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Never commit `.env.local` or expose these variables with a `NEXT_PUBLIC_`
prefix. `.env.example` is intentionally committed with placeholders only.
Menu images are hosted on Unsplash and require network access; the permitted
remote image host is configured in `next.config.ts`.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

There is currently no automated test script in `package.json`; the commands
above validate lint, TypeScript, and the production build.

## Deployment

The app can be built for a Node.js host or imported into a Next.js-compatible
platform such as Vercel. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
`AUTH_SECRET` as private environment variables in the deployment platform
before serving traffic. Use HTTPS in production so the session cookie is
secure. A local production run is:

```bash
npm ci
npm run build
npm start
```

The current order dataset is held in process memory. Orders and status changes
are lost when the process restarts and may not be shared between serverless
instances. Therefore, this mock persistence is suitable for assessment/demo
use only; durable order storage is needed before relying on it in a
multi-instance or production deployment.

## Known limitations and out-of-scope work

- Admin authentication uses one shared environment-configured credential
  pair; there are no individual accounts, roles, password rotation flows, or
  account recovery.
- Login attempts are not rate-limited. Add hosting-level or application-level
  rate limiting before a public deployment.
- Admin pages and protected order APIs require an HTTP-only signed session
  cookie. The login/logout endpoints use same-site cookie policy; public
  customer order creation remains unauthenticated by design.
- Menu data is mock data, and order persistence is process-local memory only.
- Payment processing, a database, real-time/WebSocket status updates, and
  pagination are not implemented.
- Order confirmation displays the latest status when loaded; it does not poll
  for status changes.

## Optional features not implemented

The following are intentionally outside the current assessment scope:

- Database-backed persistence.
- Payment gateway integration.
- Real-time/WebSocket order updates.
- Pagination.
- Analytics or reporting dashboards.

## Admin authentication

Use the configured credentials at `/admin/login`. `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are checked on the server; password comparison uses a
constant-time digest comparison. A successful login issues an eight-hour
HMAC-SHA256-signed session cookie. The cookie is `HttpOnly`, `SameSite=Strict`,
path-scoped to `/`, and marked `Secure` in production. The signed payload
contains only a version and expiration timestamp; it does not contain the
password or admin email.

Next.js `proxy.ts` verifies the signed cookie before protected page requests
and redirects unauthenticated users to the login page. The admin page
components also check the session before rendering. The proxy separately
returns HTTP 401 JSON for protected order API requests, and each
`GET /api/orders`, `GET /api/orders/[id]`, and `PATCH /api/orders/[id]`
Route Handler independently checks the session as defense in depth.
`POST /api/orders` remains public for checkout.

Signing out expires the session cookie. This single-admin mechanism is
assessment-appropriate, not a complete identity platform. Protect deployment
secrets, use HTTPS, and rotate `AUTH_SECRET` to invalidate existing sessions.
Changing credentials alone does not revoke already-issued stateless sessions;
they expire within eight hours. Add rate limiting and stronger operational
monitoring before exposing the admin interface publicly.

## Technical Review Notes

1. **Why Next.js App Router?** It organizes pages, layouts, loading/error UI,
   and API Route Handlers in one route-oriented structure while supporting
   server rendering by default.
2. **Why Server Components?** Static route shells, metadata, and page
   composition do not need browser state. Keeping them on the server avoids
   shipping unnecessary interactive JavaScript.
3. **Why Client Components?** Menu search/filter interactions, checkout form
   state, order management controls, cart actions, and localStorage hydration
   require browser APIs or event handlers. Those boundaries are limited to
   the components that own those interactions.
4. **Why Zustand?** The cart is shared across menu, header/drawer, and
   checkout. Zustand provides a small centralized store with selectors and
   persistence middleware without introducing a larger state framework.
5. **How does cart persistence work?** Zustand stores cart items under
   `ember-table-cart` in localStorage. Hydration is triggered after mount, and
   malformed persisted entries are discarded before the UI uses them.
6. **How are order totals calculated?** Shared helpers compute subtotal,
   5%-assumption tax rounded to cents, and grand total. The server uses those
   same helpers when creating the order.
7. **Why does the server reconstruct prices?** Browser state can be edited.
   The order endpoint accepts menu item IDs and quantities, then looks up
   current available menu items and calculates totals itself.
8. **How are API errors handled?** Route Handlers return structured
   success/error responses and appropriate HTTP status codes. Client API
   helpers validate response shapes and display user-safe retry/error
   feedback.
9. **How is admin authentication implemented?** One configured admin
   credential pair is verified server-side. Pages and order APIs check the
   signed HTTP-only session separately; production could replace this
   assessment mechanism with a trusted identity provider and per-user
   authorization.
10. **How could this scale to 1,000+ menu items?** Move menu data to a
    persistent indexed store, query/filter and paginate on the server, add
    suitable caching, and measure image/network costs. The current demo
    intentionally has no pagination.
11. **How could real-time order updates be implemented?** Add an authorized
    event channel such as Server-Sent Events, WebSockets, or a managed
    pub/sub service, publish status changes from the server, and update
    clients from validated events. Real-time updates are not present now.
12. **What are the current persistence limitations?** Order data is a
    process-local in-memory mock. It resets on restart and is not shared
    reliably between serverless or multiple application instances.
