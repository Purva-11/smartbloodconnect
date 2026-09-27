interface EmergencyAlertPayload {
  bloodGroup: string;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  unitsNeeded: number;
  urgency: string;
  contactPhone: string;
  radiusKm: number;
  coordinates: { lat: number; lng: number };
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function distanceInKm(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = radians(to.lat - from.lat);
  const longitudeDelta = radians(to.lng - from.lng);
  const haversine = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export async function handleEmergencyAlert(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !resendApiKey || !sender) {
    return json({ error: 'Email alerts are not configured on the server.' }, 503);
  }

  const accessToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!accessToken) return json({ error: 'Sign in with a connected account before sending email alerts.' }, 401);

  let payload: EmergencyAlertPayload;
  try {
    payload = await request.json() as EmergencyAlertPayload;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }
    if (!payload.bloodGroup || !payload.hospitalName || !payload.city || !payload.coordinates ||
      !Number.isFinite(payload.radiusKm) || payload.radiusKm <= 0 ||
      !Number.isFinite(payload.coordinates.lat) || !Number.isFinite(payload.coordinates.lng)) {
    return json({ error: 'Blood group, hospital, city and map coordinates are required.' }, 400);
  }

  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: supabaseAnonKey, authorization: `Bearer ${accessToken}` },
  });
  if (!authResponse.ok) return json({ error: 'Your sign-in session could not be verified.' }, 401);
  const signedInUser = await authResponse.json() as { id?: string };
  if (!signedInUser.id) return json({ error: 'Your sign-in session could not be verified.' }, 401);

  const profileUrl = new URL(`${supabaseUrl}/rest/v1/profiles`);
  profileUrl.search = new URLSearchParams({
    select: 'role,user_type',
    id: `eq.${signedInUser.id}`,
    limit: '1',
  }).toString();
  const profileResponse = await fetch(profileUrl, {
    headers: { apikey: supabaseServiceKey, authorization: `Bearer ${supabaseServiceKey}` },
  });
  if (!profileResponse.ok) return json({ error: 'Could not verify your BloodConnect profile.' }, 502);
  const profiles = await profileResponse.json() as Array<{ role?: string; user_type?: string }>;
  const profile = profiles[0];
  const canCreateRequest = profile?.role === 'organization' ||
    profile?.user_type === 'receiver' ||
    profile?.user_type === 'hospital' ||
    profile?.user_type === 'blood_bank';
  if (!canCreateRequest) return json({ error: 'Only recipients and verified organization accounts can send donor alerts.' }, 403);

  const donorUrl = new URL(`${supabaseUrl}/rest/v1/profiles`);
  donorUrl.search = new URLSearchParams({
    select: 'name,email,latitude,longitude',
    user_type: 'eq.donor',
    blood_group: `eq.${payload.bloodGroup}`,
    is_available_for_emergency: 'eq.true',
    emergency_alerts: 'eq.true',
    limit: '1000',
  }).toString();
  const donorResponse = await fetch(donorUrl, {
    headers: { apikey: supabaseServiceKey, authorization: `Bearer ${supabaseServiceKey}` },
  });
  if (!donorResponse.ok) return json({ error: 'Matching donors could not be loaded.' }, 502);
  const donors = (await donorResponse.json() as Array<{ name?: string; email?: string; latitude?: number; longitude?: number }>)
    .filter(donor => donor.email && donor.email.includes('@') &&
      Number.isFinite(donor.latitude) && Number.isFinite(donor.longitude) &&
      distanceInKm(payload.coordinates, { lat: donor.latitude!, lng: donor.longitude! }) <= payload.radiusKm);
  if (!donors.length) return json({ sent: 0, message: 'No opted-in donors with matching blood group were found within the alert radius.' });

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${payload.coordinates.lat},${payload.coordinates.lng}`;
  const emailText = [
    'A BloodConnect recipient needs an urgent blood donation.',
    '',
    `Blood group: ${payload.bloodGroup}`,
    `Units needed: ${payload.unitsNeeded}`,
    `Urgency: ${payload.urgency}`,
    `Hospital: ${payload.hospitalName}`,
    `Address: ${payload.hospitalAddress || payload.city}`,
    `City: ${payload.city}`,
    `Alert radius: ${payload.radiusKm} km`,
    `Location: ${mapUrl}`,
    `Contact: ${payload.contactPhone}`,
    '',
    'Please contact the hospital directly if you are able to help.',
  ].join('\n');

  const outcomes = await Promise.all(donors.map(async donor => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${resendApiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: sender,
        to: [donor.email],
        subject: `Urgent ${payload.bloodGroup} blood request near ${payload.city}`,
        text: `Hello ${donor.name || 'Donor'},\n\n${emailText}`,
      }),
    });
    return response.ok;
  }));
  const sent = outcomes.filter(Boolean).length;
  return json({ sent, failed: outcomes.length - sent, message: `${sent} donor email${sent === 1 ? '' : 's'} sent.` });
}