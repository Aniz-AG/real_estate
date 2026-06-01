# Real Estate App Context (Next.js)

This workspace is a Next.js 15 app (React 19) with integrated API routes under pages/api. Ignore /backend and /frontend folders (legacy versions).

## High-Level Architecture

- Frontend pages live in /pages and use a shared Layout (Navbar + Footer).
- API routes in /pages/api provide auth, property search/listing, contact, and admin functions.
- MongoDB via Mongoose for data models. Auth via JWT stored in HTTP-only cookie.
- Redux Toolkit manages client state (user auth/profile, property lists/search, admin slices).
- Media uploads go to Cloudinary; OTP via Twilio; optional Redis URI in env.

## Key User Flows

- Auth: Phone OTP login (send OTP, verify OTP) and registration with photo upload.
- Browse: Search/filter properties, property details, save/like properties.
- Profile: View/edit profile (username/city/state + optional photo), logout.
- Contact: Public contact form -> Contact collection.
- Admin: Dashboard + users, properties, contacts, testimonials management.

## Frontend Pages (routes)

- / (Home) - Featured/latest properties, city-based property lists, search UI.
- /browse - Advanced search + filters (city, type, price, area, amenities, etc.).
- /property/[id] - Property detail, gallery, like/unlike, agent info.
- /agents - List of agents (admins).
- /agents/[id] - Agent profile + their properties.
- /login - OTP login.
- /register - Registration with photo upload.
- /profile - User profile + edit modal.
- /contact - Contact form.
- /about - Company info + testimonials (public submission).
- /new-projects - Static placeholder list.
- /admin - Dashboard (admin only).
- /admin/users - Manage users & roles.
- /admin/properties - Manage properties, feature toggles.
- /admin/properties/add - Add property (admin only).
- /admin/properties/edit/[id] - Edit property (admin only).
- /admin/contacts - Manage contact messages.
- /admin/testimonials - Approve/feature/remove testimonials.
- /404 - Custom not found.

## Core Components

- Layout: /components/Layout.jsx wraps Navbar + Footer.
- Navbar: city selector + nav links + login/profile/admin menu.
- Footer: site links, contact info.
- ProtectedRoute: client-side auth gate (used where needed).
- SeoHead: centralized SEO tags + JSON-LD support.
- EditProfileModal: profile update modal.
- UI primitives: /components/ui/\* (Radix + Tailwind styling).

## Redux State (Client)

- /redux/store.js
  - user: auth + profile
  - property: listings, city selection, search
  - adminUser/adminProperty/adminContact: basic slices for admin pages

### User Slice

- Thunks: getMyProfile, registerUser, sendOtp, verifyOtp, updateProfile, logout
- Auth: stores token in localStorage for axios auth header; server uses HTTP-only cookie for API auth.

### Property Slice

- Thunks: getLatestProperties, getPropertiesByCity, searchProperties, getProperty
- UI: selectedCity stored in localStorage; default city is Jaipur.

## API Routes (pages/api)

### Auth

- POST /api/auth/register - multipart form, creates user, Cloudinary photo upload.
- POST /api/auth/send-otp - Twilio OTP (or dev mode).
- POST /api/auth/verify-otp - verify OTP, set cookie token.
- POST /api/auth/logout - clears auth cookie.

### User

- GET /api/user/me - current user profile (with likes). Auth required.
- PUT /api/user/profile - update username/city/state + optional photo. Auth required.
- POST /api/user/like/[pid]/[uid] - toggle like. Auth required.
- GET/POST /api/property/like/[...params] - legacy-like path, auth required.

### Property (public)

- GET /api/property/latest?city=&limit=
- GET /api/property/featured?city=&limit=
- GET /api/property/top-cities
- POST /api/property/search - advanced filters
- GET /api/property/[id]
- GET /api/property/agents - users with role=admin
- GET /api/property/agent/[id]
- GET /api/property/agent/properties/[id]

### Property (admin)

- POST /api/property/create - create listing (admin-only)
- GET/PUT/DELETE /api/admin/properties
- PUT /api/admin/properties/toggle-feature

### Contact

- POST /api/contact - create contact record.
- GET/PUT/DELETE /api/admin/contacts - manage contact messages (admin-only)

### Testimonials

- GET /api/testimonials - list approved testimonials
- POST /api/testimonials - submit testimonial
- GET/PUT/DELETE /api/admin/testimonials - manage testimonials (admin-only)

### Cities

- GET /api/cities?query=&limit= - search list of India cities.

## Models (MongoDB)

- User: username, email, phone, city, state, role, photo, likes[]
- Property: large schema (address, type, pricing, amenities, photos, status, etc.)
- Contact: name, email, phone, message, status, isRead
- Testimonial: name, email, rating, testimonial, approvals
- OTP: used for auth (see /models/otpModel.js)

## Shared Libraries

- /lib/db.js - Mongo connection with retries
- /lib/middleware.js - auth helpers (JWT cookie + admin guard)
- /lib/helpers.js - JWT, Cloudinary, async handler
- /lib/indiaCities.js - city list
- /lib/utils.js - Tailwind class merge

## Config & Tooling

- Next.js config: /next.config.js (env pass-through, security headers, Cloudinary domain)
- Tailwind & PostCSS in /tailwind.config.js and /postcss.config.js
- Sitemap via next-sitemap (postbuild)

## Environment Variables

- MONGO_URI, JWT_SECRET
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
- REDIS_URI (optional)
- NEXT_PUBLIC_SITE_URL (for canonical URLs)

## Notes / Quirks

- Auth uses HTTP-only cookie set in /api/auth/verify-otp; client also sets token in localStorage for axios auth header.
- selectedCity stored in localStorage; defaults to Jaipur.
- /backend and /frontend folders are legacy and not used by the current app.
