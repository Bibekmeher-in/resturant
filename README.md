# Restaurant Ordering App

A Next.js App Router foundation for a restaurant online ordering and order management application.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse the restaurant menu.

Run the checks with:

```bash
npm run lint
npm run build
```

## Project structure

Application routes and the root layout live in `src/app`. Shared page chrome is in
`src/components/layout`; reusable menu, cart, and checkout components are in
their respective folders, while `ui` and `admin` reserve boundaries for future
work. `src/data` contains application data, `src/types` contains domain
types, and `src/store` contains client state. `src/lib` holds shared API,
calculation, and validation helpers.

The homepage presents a customer-facing menu backed by `GET /api/menu`.
Search is debounced and category/search filters are sent to the API. The
shopping cart uses Zustand with localStorage persistence. Checkout validates
customer details and submits cart item IDs and quantities to `POST /api/orders`;
the server reconstructs item details and calculates totals. Cart data is
restored after hydration to keep server-rendered markup consistent with the
browser's persisted state. Admin interfaces are not implemented.

## API and mock persistence

Route handlers are in `src/app/api`. They use shared request/response helpers
and order business logic in `src/lib/api`, with the mock data source and access
functions in `src/data` and `src/lib/data-access.ts`.

Orders created or updated through the API are stored in process memory only.
They are temporary: restarting the server clears changes, and serverless
platforms such as Vercel may handle requests in different instances that do not
share memory. This mock persistence is for assessment and local development;
it is not durable storage.
