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
- Admin order list, status filters, order details, and status updates.

## Technology stack

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- Tailwind CSS 4
- Zustand 5 for cart state
- React Hook Form and Zod for checkout form validation

## Architecture

The application uses the App Router under `src/app`. Route pages, layouts,
metadata, and the admin dashboard redirect are Server Components by default.
Interactive behavior is isolated in client components:

- `MenuPage` is a Client Component because it manages search/filter state,
  debounces input, requests filtered menu data, and adds available items to the
  cart.
- `CheckoutPage` is a Client Component for React Hook Form, client validation,
  cart state, submission feedback, and navigation after a successful request.
- `OrderConfirmation` fetches the order from `GET /api/orders/[id]` in the
  browser and provides loading, retry, and not-found states. Keeping this
  lookup on the API path avoids relying on a separate server module instance
  for the in-memory mock store.
- `OrderManagement` and its detail/status controls are Client Components for
  interactive filtering, selection, and status updates.
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
    api/
    checkout/
    order-success/
    globals.css
    layout.tsx
    page.tsx
  components/
    admin/
    cart/
    checkout/
    layout/
    menu/
    order-success/
    ui/
  data/
  lib/
    api/
    calculations/
    formatters/
    validations/
  store/
  types/
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
| `GET` | `/api/orders/[id]` | Retrieve one order for confirmation/details. |
| `PATCH` | `/api/orders/[id]` | Update an order to a supported status. |

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

There are no required environment variables for the current mock
implementation. No `.env` file is needed. Menu images are hosted on Unsplash
and require network access; the permitted remote image host is configured in
`next.config.ts`.

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
platform such as Vercel. A local production run is:

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

- This assessment implementation has no authentication or authorization.
  Admin pages and order APIs expose customer contact and delivery information;
  do not deploy the demo publicly with real customer data.
- Menu data is mock data, and order persistence is process-local memory only.
- Payment processing, a database, real-time/WebSocket status updates, and
  pagination are not implemented.
- Order confirmation displays the latest status when loaded; it does not poll
  for status changes.
