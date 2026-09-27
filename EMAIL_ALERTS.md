# Emergency Email Alerts

The SOS email endpoint is server-side and sends one Resend email per matching, opted-in donor. It verifies the caller's Supabase access token, permits recipient or organization accounts, and never accepts recipient email addresses from the browser.

## Required configuration

Set these server environment variables in Vercel (and locally before starting Vite):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (a sender address verified by Resend)

The Supabase `profiles` table must include `id`, `role`, `user_type`, `name`, `email`, `blood_group`, `latitude`, `longitude`, `is_available_for_emergency`, and `emergency_alerts`. `role` is `individual` or `organization`; `user_type` includes `donor`, `receiver`, `hospital`, or `blood_bank`. Matching donors must have both alert and availability fields set to `true` and coordinates within the SOS radius.

Connect the UI to Supabase Auth and store the signed-in access token in `sessionStorage` under `bloodconnect.accessToken`. The current workspace uses mock authentication and has no Supabase project credentials, so the endpoint will correctly refuse to send until that connection and the server secrets are configured. Do not put the service-role or Resend keys in any `VITE_` variable.