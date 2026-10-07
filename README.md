# Multi Equipment Trade and Services

Medical equipment storefront for Multi Equipment Trade and Services Pvt. Ltd., Chakupat-10, Lalitpur, Nepal.

## What is implemented

Responsive storefront; product search by name, brand, category, SKU and tags; autocomplete; category, brand, type, availability, featured and price filters; sorting; product galleries; product information, specifications, warranty and document fields; persistent cart; Nepal checkout; order confirmation; quotation, service and contact forms; WhatsApp product messages; company pages; editable policy pages; customer account order history; moderated reviews; protected admin CRUD and request management.

Orders are requests pending company confirmation. Unknown prices remain `null`; no fake price or grand total is generated. Shipping requires confirmation. No payment is collected online. Admin-configured payment labels describe offline arrangements; they are not integrations with payment gateways.

## Stack

React 19, TypeScript, Tailwind 4 and Next.js App Router APIs through the Sites-provided Vinext runtime. Production output is a Cloudflare Worker. Persistent data uses D1 (SQLite), with Drizzle schema and versioned migrations. UI primitives are the installed Shadcn/Radix components.

## Local setup

Requires Node.js 22.13 or later and npm. Run inside this directory:

```sh
npm run install:ci
cp .env.example .dev.vars
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_medical_rogue.sql
npm run dev
```

On Windows use `Copy-Item .env.example .dev.vars` instead of `cp`. If the installed npm command wrapper fails, invoke its JavaScript entrypoint directly, for example `node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" run build`.

Apply the initial migration only once to a fresh local database. Later migrations are appended and applied in sequence. Do not replay or modify an already-applied migration. Production migrations are applied by Sites before deployment.

The dev server prints its local URL. Use `/admin` to manage the site. The bundled localhost sign-in flow simulates `seedy@sites.test` only after clicking Sign in with ChatGPT. To test admin locally, put `ADMIN_EMAILS=seedy@sites.test` in the ignored `.dev.vars`. This local mock is absent from production. Do not add that email to the production allowlist.

## Runtime configuration

| Variable / binding | Purpose |
| --- | --- |
| `DB` | D1 binding managed through `.openai/hosting.json` and Sites. |
| `ADMIN_EMAILS` | Server-only comma-separated approved administrator sign-in emails. Empty or missing denies all admin access. Configure as a secret in Sites. |
| `CATALOG_PREVIEW` | `true` exposes unpublished sample records only to authenticated visitors. Enable only while this Site is owner-private. Set `false` before public launch. |

No payment, WhatsApp or other API credentials are needed. WhatsApp uses normal `wa.me` links. Do not put secrets into product records, Website Content, source files or `NEXT_PUBLIC_*` variables. Hosted settings must be configured through Sites; local `.dev.vars` and `.env*` files do not upload.

New deployments are private. The review site can be opened by its owner. Making it public is a separate access decision; disable catalogue preview, finish content verification and configure an approved administrator first.

## Admin usage

1. Configure `ADMIN_EMAILS` with the email used to sign in, then redeploy to apply the runtime revision.
2. Open `/admin`, sign in and choose Products.
3. Edit a record; enter verified descriptions, model details, SKU, images, price, stock and specifications. Images accept HTTPS URLs or local `/images/` paths. Documents accept HTTPS URLs.
4. Publishing requires a separate checkbox confirming legitimate supply, product information and image permissions. Example records start unpublished and are never shown to anonymous visitors.
5. Manage categories and brands separately. Brand publication also requires verification; no official-distributor claim is generated.
6. Orders support Pending, Confirmed, Processing, Shipped, Delivered and Cancelled, plus payment and delivery notes. Orders preserve product and price snapshots. Stock is checked on submission but is not reserved or decremented for an unconfirmed request.
7. Quotations, service requests and inquiries support Pending, Contacted, In progress, Completed and Cancelled. Service requests have internal notes. Customers show their order history. Reviews require approval to become public.
8. Website Content edits hero text and image, promotions, contact details, office hours, About sections, payment labels and policy text. Phone display and phone-link fields are separate; WhatsApp uses digits including country code.

Admin tables currently load the latest 500 records. Add server-side pagination and exports if operational volume exceeds this limit. Product images are managed by URL; a media upload library is not part of this build.

## Folder structure

```text
app/                    App Router pages, metadata, loading and error states
  [...path]/page.tsx     Storefront routes and protected order confirmations
  admin/                Protected admin entry
  api/                  Cart, submissions, catalogue and admin endpoints
components/             Reusable storefront, forms, catalogue and admin screens
  ui/                   Installed accessible UI primitives
lib/                    Catalogue types, validation, D1, cart, security and settings
db/schema.ts            18 reusable database tables
drizzle/                Generated schema-only SQL migrations and metadata
public/images/          Optimized product references and illustrative hero
build/                  Sites Worker, security headers and build integrations
scripts/                Development/build helpers and local functional tests
.openai/hosting.json     Site identity and logical DB binding; no credentials
.env.example            Runtime variable documentation
```

Entities include User, Customer, Product, Category, Brand, ProductImage, ProductSpecification, Cart, Order, OrderItem, Quotation, ServiceRequest, ContactInquiry, Review and Address. Product data keeps editable nested fields in JSON; image and specification rows are mirrored on admin saves. Order snapshots survive product edits/deletion. D1 batch operations save the order, customer, address, items and idempotency record atomically.

## Validation and security

Zod validates public and admin input; React escapes text; SQL uses bound parameters; mutation endpoints require same-origin JSON; public submissions are rate limited in D1 and have a honeypot; checkout submissions are idempotent; carts use an HTTP-only SameSite cookie and compare-and-swap updates; order confirmations require the cart session or authenticated order owner; server-side email allowlisting protects every admin read and write. The production Worker sets CSP, no-sniff, referrer and browser-permission headers. APIs do not cache private responses.

The platform verifies authentication headers. Only deploy behind the Sites dispatcher; a standalone public Worker must add a trusted authentication boundary and reject forged identity headers before using these auth helpers.

## Payment extension

Keep a gateway adapter server-side. Use environment secrets for credentials, persist a payment attempt linked to an order, verify signed callbacks and amounts, use idempotency keys, and update payment state only from a verified gateway response. Never infer success from the browser redirect. None of these credentials or an unverified gateway integration is included.

## Verification

```sh
node node_modules/typescript/bin/tsc --noEmit
node scripts/smoke-test.mjs
npm run build
```

The smoke test targets only `http://127.0.0.1:5173` and creates clearly named QA records in the local database. Run on a fresh disposable local database with the mock admin configured and catalogue preview enabled; never target production. It checks authentication, draft visibility, form validation, cart persistence, priced/quote-only totals, stock, checkout idempotency, ownership, product CRUD, review moderation and main routes. QA records must be removed by their identifying names before using the local database for real operations.

Desktop and mobile layout checks are recorded in `../VERIFICATION.md`. No Lighthouse score is claimed; run a Lighthouse audit against the final public domain after verified content is configured.

## Before public launch

- Verify legitimately supplied brands/models, specifications, prices, stock and warranty information. The sample model records are drafts.
- Replace representative PAP imagery with the correct confirmed model and confirm permission for manufacturer product photos. See `ASSETS.md`.
- Approve final privacy, terms, shipping, return, warranty and medical-disclaimer text. Current text is a cautious interim draft and does not invent business terms.
- Set business hours, configure administrator email access, disable `CATALOG_PREVIEW` and confirm all phone/WhatsApp links.
- Confirm payment and delivery arrangements. No real gateway is connected.
- If changing the domain, update `siteOrigin` in `lib/catalog.ts` and the metadata base in `app/layout.tsx`, then rebuild.

Do not represent this private review as a fully verified public commercial launch until these business inputs are completed.

## FormSubmit email notifications

Contact inquiries, quotations, service requests, orders and submitted reviews are saved in the database and forwarded server-side to metsnepal.services@gmail.com through FormSubmit. Set FORM_SUBMIT_RECIPIENT to override the recipient; no API key is required. The default recipient is the company email in lib/catalog.ts.

Activate the inbox by opening FormSubmit's confirmation email after the first submission. Until activation, notifications are marked activation_required. Provider acceptance is marked accepted; this means FormSubmit accepted the notification, not verified inbox delivery. Failed notifications do not erase the saved request. Administrators can see the email status and use Retry email after activation or a delivery failure. Repeating a customer's submission with the same idempotency key does not send a duplicate email. An interrupted sending status requires administrator investigation before retrying, to avoid an uncertain duplicate.

The email_notifications table is initialized by seed() and also declared in db/schema.ts. Notifications include request references and validated submission fields. Customer email is used as Reply-To where present. No customer autoresponse email is promised. Keep outgoing HTTPS access to formsubmit.co available on the server.

Setup verification: the labeled contact test 2706482b-af36-462d-9021-e852bbf122ae was saved and FormSubmit returned activation_required. Inbox delivery must be checked after the recipient confirms activation.
