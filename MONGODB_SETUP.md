# MongoDB Setup

The MongoDB connection is used only by the server handlers in `api/`. Never put the connection URI in a `VITE_` variable or frontend source.

1. Create a MongoDB database user with the minimum permissions needed for the application database. Rotate any password that has been shared in chat or committed to a terminal transcript.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, `MONGODB_DB`, and a unique `SESSION_SECRET` of at least 32 characters.
3. Add the same variables to the deployment platform's server environment. The project has Vercel-style handlers in `api/`; local development routes are provided by Vite.
4. Start the app with `npm run dev` and register an account. Authentication profiles and consent are stored in `users`; camp listings, emergency SOS requests, camp registrations, and QR attendance changes use MongoDB through the authenticated `/api/data` route.

Passwords are salted and hashed with Node's `scrypt`. Data API requests require a signed, short-lived session token and apply basic ownership checks. Other dashboard fixtures (including hospitals, blood banks, notifications, and audit logs) remain mock-driven, as does the Supabase-dependent email alert handler; those features have not been migrated yet.